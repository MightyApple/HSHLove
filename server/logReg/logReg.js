const {uploadImage} =require("../imageProcessing/imageProcessing") 

const express = require('express')
//const database = require('./database.js'); mongoHSHLove sollte ausreichen
const path = require("path")
const bcrypt = require("bcrypt")
const mongoHSHLove = require("../mongodb")
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const router = express.Router();

//google bucket storage für die Bilder
const gc = new Storage({
  keyFilename: path.join(__dirname, "../config/hshloveKey.json"),
  projectId: 'hshlove'
})
const profilbilder = gc.bucket('profilbilder')
//multer für Bilderverarbeitung
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

router.get("/logOut",(req,res)=>{
  if (req.session) {
    req.session.destroy();
    res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.')
  }
})
//template funktion wie es mir gefällt
const requireAuth = (req,res,next)=>{
  const {user} =req.session.user;
  if(!user){
    return res.status(401).json({ message: "unauthorized"})
  }
  next();
}

router.get('/getUserData', async (req, res) => {
  if(req.session.authorized){
    const user = await mongoHSHLove.userDataCollection.findOne({
      _id:req.session.user._id 
    })
    res.json({data:user})
  }else{
    res.status(401).json({ email: "login"})
  }
})


router.get('/authenticate',(req,res)=>{
  res.json({authentication:req.session.authorized}) 
})

router.get("/", (req, res) => {
  
})

router.get("/personalSpace", async (req, res) => {
  if (!req.session.authorized) {
    res.render("login")
  } else {
    try {
      const [files] = await profilbilder.getFiles({ prefix: req.session.user._id })
      var temp = []
      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);

        temp.push(file.name)
      });
      var data = Object.assign(req.session.user, { googleImages: temp })

      res.render("profil", data)
      //res.render("profil",req.session.user) 
    } catch (error) {
      //res.send("Error:" + error);
    }
  }
})
function stringToArray(string){
  try{
    var array = string.split(",")
    return array
  }catch(e){
    return string
  }
  
  
}
router.post("/signup", multer.fields([{name:"images", maxCount: 6}]),async (req, res) => {
  try {
    
    const incomingData = req.body;
    //console.log("data: " +incomingData.email, incomingData.password, incomingData.firstname, incomingData.birthdate, incomingData.description, incomingData.degree, incomingData.gender, incomingData.intention, incomingData.tags, incomingData.preference)
    //console.log("passwort hashen")
    let tagsArr=stringToArray(incomingData.tags)
    let prefArr=stringToArray(incomingData.preference)
    let intentArr=stringToArray(incomingData.intention)
    const hash = await bcrypt.hash(incomingData.password, 10)
    const degree = await mongoHSHLove.courseCollection.findOne({
      name: incomingData.degree,
    });
    const data = {
      email: incomingData.email,
      password: hash,
      name: incomingData.firstname,
      birthday: incomingData.birthdate,
      description: incomingData.description,
      degree: degree._id,
      gender: incomingData.gender,
      intention: intentArr,
      tags: tagsArr,
      preference: prefArr,
    }
    
    const t = await mongoHSHLove.userDataCollection.insertMany([data]).then(()=>{
      try{
        if(req.files){
          uploadProfileImages(req.files,true,incomingData.email);
          
        }
      }catch(e){
        console.log(e)
      }
    })
    res.send({noError:true})
    //alles nach der eingabe in die datenbank wird hiernach ausgeführt  
  } catch (e) {
    console.log(e)
    res.status(500).send("something broke in the registration")
  }
})

async function uploadProfileImages(imgs,newUser,email){
  const user = await mongoHSHLove.userDataCollection.findOne({
    email: email,
  })
  const uId = user._id
  if (user && imgs.images) {
    for(let i=0;i<imgs.images.length;i++){
      if(newUser){
        var img = prepareImage(imgs.images[i],i+1,user._id)
        uploadImage(img)
        updateDatabaseImgInformation(img.originalname,email)
      }else{
        const user = await mongoHSHLove.userDataCollection.findOne({
          _id: uId,
        })
        let x = await profilbilder.getFiles({ prefix: user._id})
        let size = x[0].length
        let imgNr = size+1
        var img = prepareImage(imgs.images[i],imgNr,user._id)    
        uploadImage(img)
        updateDatabaseImgInformation(img.originalname,email)
      }
    }
  }  
}
async function updateDatabaseImgInformation(imgName, email){
  await mongoHSHLove.userDataCollection.findOneAndUpdate({ email: email }, { $push: { images: imgName } })
}
function prepareImage(img, imgNr,uId){
  try {
    //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
    try {
      if (img) {
        let newName=uId + "_" + imgNr.toString() + ".jpeg"
        let newFile = {
          fieldname: img.fieldname,
          originalname: newName,
          encoding: img.encoding,
          mimetype: img.mimetype,
          buffer: img.buffer,
          size: img.size
        }
        return newFile;
        /*const blob = profilbilder.file(newFile.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.end(newFile.buffer);*/

      } else {

        
      }
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    res.status(500).send(error);
  }
}



router.post("/login", async (req, res) => {
    
  try {
    const { email, password } = req.body;
    
    const user = await mongoHSHLove.userDataCollection.findOne({
      email: email,
    })
    
    if (user) {
      const validPass = await bcrypt.compare(password, user.password)
      if (validPass&&user.roll!=="Disabled") {
        //falls die daten stimmen wird der codeblock ausgeführt
        // session wird angelegt
        try{
          
          req.session.user = user;
          req.session.authorized = true;
          
          if(user.roll=="Admin"){
            res.send( {role:user.roll})
          }else{
            res.send({noError:true, role:user.roll})
          }
          
        }catch(e){
          throw e
        }
        
      } else {
        //und falls nicht dieser
        res.send({message:"Passwort inkorrekt",noError:false})
      }
    }else{
      res.send({message:"Nutzer mit der Email existiert nicht"})
    }
  }
  catch {
    res.send("wrong details")
  }


})

router.get("/upload", async (req, res) => {
  try {
    const [files] = await profilbilder.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});
const isObjectEmpty = (objectName) => {
          return Object.keys(objectName).length === 0
        }

router.post("/updateProfile", multer.fields([{name:"images", maxCount: 6}]), async (req, res) => {
  try {
    let newFile
    
    const incomingData = req.body;
      try {
        //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
        
        try {
          
          if (!isObjectEmpty(req.files)) {
            try{
              uploadProfileImages(req.files,false,req.session.user.email);
            }catch(e){

            }
            
          }
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        res.status(500).send(error);
      }

      try {
        let tagsArr=stringToArray(incomingData.tags)
        let prefArr=stringToArray(incomingData.preference)
        let intentArr=stringToArray(incomingData.intention)

        const degree = await mongoHSHLove.courseCollection.findOne({
          name: incomingData.degree,
        });
        const data = {
          description: incomingData.description,
          degree: degree._id,
          gender: incomingData.gender,
          intention: intentArr,
          tags: tagsArr,
          preference: prefArr,
        }
        
        
        if (!isObjectEmpty(req.files)) {

          var userUpdate= await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": req.session.user._id }, { $set: data, $push: { images: newFile.originalname } })
        } else {

          var userUpdate = await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": req.session.user._id }, { $set: data })
        }
        req.session.user=userUpdate
        res.status(200).send("Success");
      } catch (error) {

        res.status(500).send(error);
      }
      
    
  } catch (e) {
    console.log(e)

  }
})

router.post("/removeImage", async (req,res)=>{
  let data=req.body;
  let srcString= data.src.split("/")[4];
  try{
    console.log(srcString)
    await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": req.session.user._id,  }, { $pull: {images:srcString} })
    res.send({ok:true})
  }catch(e){
    res.status(500).send({ok:false})
  }
  
})

router.get("/getImages", async (req, res) => {
  try {
    if(req.session.authorized){
      const user = await mongoHSHLove.userDataCollection.findOne({
        _id: req.session.user._id,
      }).then((user)=>{
        res.send(user.images)
      })
    }else{res.status(500).send("not Authorized")}
    
  } catch (error) {
    res.send("Error:" + error);
  }
});

router.post("/validateData", async (req, res) => {
  try {
    const { email, password, passwordwdh } = req.body;
    const user = await mongoHSHLove.userDataCollection.findOne({
      email: email,
    })
    if (user == null ) {
      if(password == passwordwdh){
        res.send({noError:true})
      }else{
        res.send({message:"Passwörter stimmen nicht überein!",noError:true})
      }
      
    } else {
      //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
      res.send({message:"Nutzer mit der Email existiert bereits",noError:false});
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("something broke in the registration")
  }
})



module.exports = {
  router,
  requireAuth,

}