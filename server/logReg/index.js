const express=require("express")
const app =express()
const path=require("path")
const hbs=require("hbs")
const bcrypt = require("bcrypt")
const tempaltePath=path.join(__dirname,'./template')
const mongoCollection=require("./mongodb")

app.use(express.json())
app.set("view engine","hbs")
app.set("views",tempaltePath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("login")
})

app.get("/signup",(req,res)=>{
    res.render("signup")
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

app.listen(3000,()=>{
    console.log("port connected");
})