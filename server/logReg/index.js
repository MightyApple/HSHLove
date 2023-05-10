const express=require("express")
const app =express()
const path=require("path")
const hbs=require("hbs")
const bcrypt = require("bcrypt")
const tempaltePath=path.join(__dirname,'./template')
const mongoCollection=require("./mongodb")
const session =require('express-session');
const bodyParser = require('body-parser')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const src = path.join(__dirname, "template");
app.use(express.static(src));

app.use(express.json())
app.set("view engine","hbs")
app.set("views",tempaltePath)
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: 'secret;*',
    resave: true,
    saveUninitialized: true,
    cookie:{
        sameSite: 'strict',

    }

}));

app.get("/",(req,res)=>{
    if(req.session.authorized){
        res.render('home',{email: req.session.user.email})
    }else{
        res.render("login")  
    }
    
})
app.get("/uploadFile",(req,res)=>{    
    res.render("picUpload")     
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/personalSpace",async(req,res)=>{
    if(!req.session.authorized){
        res.render("login")
    }else{
        const user=await mongoCollection.findOne({
            email:req.session.user.email,           
        })

        res.render("profil",{
            email:user.email,
            password:user.password     
        })      
    }    
})


app.post("/signup",async (req,res)=>{
    try{
        const {email,password,passwordwdh}=req.body;
        const user=await mongoCollection.findOne({
            email:email,           
        })
        
        if(!user && password==passwordwdh){
            const hash = await bcrypt.hash(password,10) 
            const data= {
                email: email,
                password: hash
            }
            console.log(data)
            await mongoCollection.insertMany([data]);
            //alles nach der eingabe in die datenbank wird hiernach ausgeführt
            res.render("home")
        }else{
            //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
            res.status(500).send("ERROR");
        }                  
    }catch(e){
        console.log(e)
        res.status(500).send("something broke in the registration")
    }   
})
//TODO personalspace daten ändern und abfragen
app.post("/personalSpace",async (req,res)=>{
    try{
        const {email,password,passwordwdh}=req.body;
        const user=await mongoCollection.findOne({
            email:email,           
        })
        const validPass = await bcrypt.compare(password,user.password)
        if(validPass){
            //falls die daten stimmen wird der codeblock ausgeführt
            // session wird angelegt
            req.session.user = user;
            req.session.authorized = true;
            res.render("home")
        }else{
            //und falls nicht dieser
            res.send("wrong password")
        }
        if(!user && password==passwordwdh){
            const hash = await bcrypt.hash(password,10) 
            const data= {
                email: email,
                password: hash
            }
            console.log(data)
            await mongoCollection.insertMany([data]);
            //alles nach der eingabe in die datenbank wird hiernach ausgeführt
            res.render("home")
        }else{
            //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
            res.status(500).send("ERROR");
        }                  
    }catch(e){
        console.log(e)
        res.status(500).send("something broke in the registration")
    }   
})

app.post("/login",async (req,res)=>{
    try{
        

        const {email,password}=req.body;
        const user=await mongoCollection.findOne({
            email:email,           
        })
        if (user){
            const validPass = await bcrypt.compare(password,user.password)
            if(validPass){
                //falls die daten stimmen wird der codeblock ausgeführt
                // session wird angelegt
                req.session.user = user;
                req.session.authorized = true;
                res.render("home")
            }else{
                //und falls nicht dieser
                res.send("wrong password")
            }
        }
    }
    catch{
        res.send("wrong details")
    }
    
    
})

//-------------------------------------------------------------------------------------------------------------------
//bilderupload
const gc=new Storage({
    keyFilename:path.join(__dirname,"./config/hshloveKey.json"),
    projectId:'hshlove'
})
const profilbilder= gc.bucket('profilbilder')

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
  });

app.get("/upload", async (req, res) => {
    try {
      const [files] = await profilbilder.getFiles();
      res.send([files]);
      console.log("Success");
    } catch (error) {
      res.send("Error:" + error);
    }
  });
  // Streams file upload to Google Storage
  app.post("/upload", multer.single("imgfile"), (req, res) => {
    console.log("Made it /upload");
    try {
      if (req.file) {
        console.log("File found, trying to upload...");
        const blob = profilbilder.file(req.file.originalname);
        const blobStream = blob.createWriteStream();
  
        blobStream.on("finish", () => {
          res.status(200).send("Success");
          console.log("Success");
        });
        blobStream.end(req.file.buffer);
      } else throw "error with img";
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
//----------------------------------------------------------



var portNr=3000;
app.listen(portNr,()=>{
    console.log("server at www.localhost:"+portNr);
})