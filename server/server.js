const express = require('express')
const { createServer } = require("http");
//const database = require('./database.js');
const cors = require('cors');
const app = express()
const path = require("path")
const bcrypt = require("bcrypt")
const mongoCollection = require("./mongodb")
const tempaltePath = path.join(__dirname, './template')
const session = require('express-session');
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const src = path.join(__dirname, "template")

app.use(express.static(src));
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", tempaltePath)
app.use(express.urlencoded({ extended: false }))
app.use(cors()); //damit der Client auf den Server zugreifen kann

const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001
var chat = require('./chat/chat.js');
const { env } = require('process');

//const httpServer = createServer(app);
//httpServer.listen(port); //app.listen(3000) geht nicht! erstellt neuen http server

app.use(function (req, res, next) { //middleware, die vor jedem request ausgeführt wird
  if (!req.headers.authorization) { //wenn kein token vorhanden, dann error
    return res.status(403).json({ error: 'No credentials sent!' }); //sendet error an den client
  }

  var token = req.headers.authorization.split(" ")[1]; //nimmt den token aus dem header
  req.token = token; //speichert den token im request

  // req.username = database.getUsernameByToken(token); //speichert den usernamen im request

  next();
});

// app.use(function (req, res, next) { //middleware, die vor jedem request ausgeführt wird
//   req.username = getUsernameByToken(req.token);
//   next();
// });

app.get('/', (req, res) => {
  // console.log(req.username);
  res.send('Hello World!')
})

app.get('/getUsername', (req, res) => {
  database.findUserByToken(req.token).then((user) => { //nachdem der Eintrag gefunden wurde, senden wir den Usernamen zurück an den Client
    console.log(user.name);
    userNameObj = { name: user.name };
    res.send(userNameObj); //sendet den usernamen an den client
  }
  );
})
//app.get('/', (req, res) => {
//  res.send('Hello World!')
//})


//app.get('/getUsername', (req, res) => {
// database.findUserByToken("token123").then((user) => { //nachdem der Eintrag gefunden wurde, senden wir den Usernamen zurück an den Client
//   console.log(user.name);
//  userNameObj = {name: user.name};
//  res.send(userNameObj); //sendet den usernamen an den client
// }
//  );
//})

//chat.serverInitialisieren(httpServer);
//-------------------------------------------------
app.use(session({
  secret: 'secret;*',
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: 'strict',
  }
}));

app.get("/", (req, res) => {
  if (req.session.authorized) {
    res.render('home', { email: req.session.user.email })
  } else {
    res.render("login")
  }
})


chat.serverInitialisieren(httpServer);
app.get("/signup", (req, res) => {
  res.render("signup")
})
app.get("/login", (req, res) => {
  res.render("login")
})
app.get("/personalSpace", async (req, res) => {
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


app.post("/signup", async (req, res) => {
  try {

    const { email, password, passwordwdh } = req.body;
    const user = await mongoCollection.findOne({
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

      await mongoCollection.insertMany([data]);


      //alles nach der eingabe in die datenbank wird hiernach ausgeführt
      res.render("home")
    } else {
      //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
      res.status(500).send("ERROR");
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("something broke in the registration")
  }
})
//TODO personalspace daten ändern und abfragen




app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await mongoCollection.findOne({
      email: email,
    })
    if (user) {
      const validPass = await bcrypt.compare(password, user.password)
      if (validPass) {
        //falls die daten stimmen wird der codeblock ausgeführt
        // session wird angelegt
        req.session.user = user;
        req.session.authorized = true;
        res.render("home")
      } else {
        //und falls nicht dieser
        res.send("wrong password")
      }
    }
  }
  catch {
    res.send("wrong details")
  }


})


const gc = new Storage({
  keyFilename: path.join(__dirname, "./config/hshloveKey.json"),
  projectId: 'hshlove'
})
const profilbilder = gc.bucket('profilbilder')

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

app.post("/personalSpace", multer.single("imgfile"), async (req, res) => {
  try {
    let newFile
    let imgNr;


    const uId = req.session.user._id
    var { name, birthday, description, password } = req.body;



    const user = await mongoCollection.findOne({
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
          await mongoCollection.findOneAndUpdate({ "_id": uId }, { $set: data, $push: { images: newFile.originalname } })
        } else {
          await mongoCollection.findOneAndUpdate({ "_id": uId }, { $set: data })
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


var portNr = 3000;
app.listen(portNr, () => {
  console.log("server at www.localhost:" + portNr);
})
