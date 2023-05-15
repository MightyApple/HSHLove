const express = require('express')
//const database = require('./database.js'); mongoHSHLove sollte ausreichen
const cors = require('cors');
const app = express()
const path = require("path")
const bcrypt = require("bcrypt")
const mongoHSHLove = require("../mongodb")
const session = require('express-session');
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const router = express.Router();;
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()); //damit der Client auf den Server zugreifen kann

//Session mit cookies
router.use(session({
  secret: "lol",
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: 'strict',
  }
}));

//google bucket storage für die Bilder
const gc = new Storage({
  keyFilename: path.join(__dirname, "./config/hshloveKey.json"),
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



//template funktion wie es mir gefällt
const requireAuth = (req,res,next)=>{
  const {user} =req.session.user;
  if(!user){
    return res.status(401).json({ message: "unauthorized"})
  }
  next();
}

router.get('/getEmail', (req, res) => {
  if(req.session.authorized){
    res.json({email:req.session.user.email})
  }else{
    res.status(401).json({ email: "Meld dich an um deinen Namen hier zu lesen"})
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
    console.log(req.session.user)

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

router.post("/signup", async (req, res) => {
  try {

    const { email, password, passwordwdh } = req.body;
    const user = await mongoHSHLove.userDataCollection.findOne({
      email: email,
    })
    console.log(user)
    if (user == null && password == passwordwdh) {
      console.log("passwort hashen")
      const hash = await bcrypt.hash(password, 10)
      const data = {
        email: email,
        password: hash
      }

      const t = await mongoHSHLove.userDataCollection.insertMany([data]);
      console.log(t)
      res.send({noError:true})
      //alles nach der eingabe in die datenbank wird hiernach ausgeführt
      console.log("schau in die DB")
    } else {
      //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
      res.send({noError:false});
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("something broke in the registration")
  }
})
//TODO personalspace daten ändern und abfragen




router.post("/login", async (req, res) => {
    
  try {
    const { email, password } = req.body;
    
    const user = await mongoHSHLove.userDataCollection.findOne({
      email: email,
    })
    
    if (user) {
      const validPass = await bcrypt.compare(password, user.password)
      
      if (validPass) {
        //falls die daten stimmen wird der codeblock ausgeführt
        // session wird angelegt
        try{
          
          req.session.user = user;
          req.session.authorized = true;
          
          
          res.send({noError:true})
        }catch(e){
          throw e
        }
        
      } else {
        //und falls nicht dieser
        res.send({noError:false})
      }
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

router.post("/personalSpace", multer.single("imgfile"), async (req, res) => {
  try {
    let newFile
    let imgNr;


    const uId = req.session.user._id
    var { name, birthday, description, password } = req.body;



    const user = await mongoHSHLove.userDataCollection.findOne({
      _id: uId,
    })
    const validPass = await bcrypt.compare(password, user.password)

    if (user && validPass) {
      try {

        //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
        if (user.toJSON().images.length === 0) {
          imgNr = 1
        } else {
          imgNr = (parseInt(user.toJSON().images[user.toJSON().images.length - 1].split("_").pop().split(".")[0]) + 1)
        }
        try {
          if (req.file) {
            newFile = {
              fieldname: req.file.fieldname,
              originalname: uId + "_" + imgNr.toString() + ".jpeg",
              encoding: req.file.encoding,
              mimetype: req.file.mimetype,
              buffer: req.file.buffer,
              size: req.file.size
            }

            const blob = profilbilder.file(newFile.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.end(newFile.buffer);

          } else {

            throw "error with img";
          }
        } catch (error) {
          console.log(error)
        }

      } catch (error) {

        // res.status(500).send(error);
      }
      try {

        const data = {
          name: name,
          birthday: birthday,
          description: description,
        }


        if (req.file) {
          await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data, $push: { images: newFile.originalname } })
        } else {
          await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data })
        }

        //res.status(200).send("Success");
      } catch (error) {

        //res.status(500).send(error);
      }
      res.render("home")
    } else {
      //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
      //res.status(500).send("ERROR");
    }
  } catch (e) {
    console.log(e)

  }
})
module.exports = {
  router,
  requireAuth
}