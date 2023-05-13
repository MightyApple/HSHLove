const express=require("express")
const app =express()
const path=require("path")
const bcrypt = require("bcrypt")
const tempaltePath=path.join(__dirname,'./template')
const mongoCollection=require("./mongodb")
const session =require('express-session');
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
        let user=await mongoCollection.findOne({
            email:req.session.user.email,           
        })
        
        

        res.render("profil",user)      
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
async function emailexists(email){
    const user=await mongoCollection.findOne({
        email:email,           
    })
    if(user){
        return true;
    }
}
//TODO personalspace daten ändern und abfragen




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

  app.get("/test",  async(req, res) => {

    var imageData = []
    
    await mongoCollection.findOneAndUpdate({"_id":"645b9cf07915d6714c342664"},  {$push:{images:"bilder"},$set:{name:"gay"}})
    
    
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
app.post("/personalSpace",multer.single("imgfile"),async (req,res)=>{
    try{
        let newFile
        let imgNr;
        const uId = req.session.user._id
        const {name,birthday,description,password}=req.body;
        
        const user=await mongoCollection.findOne({
            _id:uId,           
        })       
        const validPass = await bcrypt.compare(password,user.password)
        
        if(user&& validPass){
            try{
                
                //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
                if(user.toJSON().images.length === 0){
                    
                    imgNr=1 
                    
                }else{
                    
                    imgNr = (parseInt(user.toJSON().images[user.toJSON().images.length -1].split("_").pop().split(".")[0]) +1) 
                                    
                }

                
                if (req.file) {
                    
                    newFile={
                        fieldname : req.file.fieldname,
                        originalname : uId+"_"+imgNr.toString()+".jpeg",
                        encoding : req.file.encoding,
                        mimetype : req.file.mimetype,
                        buffer : req.file.buffer,
                        size : req.file.size
                    }
                    
                    const blob = profilbilder.file(newFile.originalname);
                    const blobStream = blob.createWriteStream();
                    
                    blobStream.end(newFile.buffer);
                    
                } else {
                    
                    throw "error with img";}
            } catch (error) {
                
               // res.status(500).send(error);
            }
            try{
                
                const data= {
                    name: name,
                    birthday: birthday,
                    description: description,
                }
 
                await mongoCollection.findOneAndUpdate({"_id":uId}, {$set:data, $push:{images:newFile.originalname}})
                
                const danach=await mongoCollection.findOne({
                    _id:uId           
                }) 
                
                //res.status(200).send("Success");
            } catch (error) {
                
                //res.status(500).send(error);
            }
            res.render("home")
        }else{
            //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
            //res.status(500).send("ERROR");
        }                  
    }catch(e){
        console.log(e)
        
    }   
})


var portNr=3000;
app.listen(portNr,()=>{
    console.log("server at www.localhost:"+portNr);
})