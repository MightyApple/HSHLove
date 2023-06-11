const express = require("express");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");

const database = require("./database.js");
const chat = require("./chat/chat.js");
const { router: routes, requireAuth } = require("./logReg/logReg.js");
const { router: matchRoutes } = require("./matchPage/matchPage.js");
const { uploadChatImage } = require("./imageProcessing/imageProcessing.js");

const app = express();
const httpServer = createServer(app);
const src = path.join(__dirname, "template");
const port = process.env.PORT || 3001; //nimmt den Port aus der Umgebungsvariablen oder 3001
const upload = multer();

app.use(express.static(src));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //damit der Client auf den Server zugreifen kann

//Session mit cookies
app.use(
  session({
    secret: "lol",
    resave: true,
    saveUninitialized: true,
    cookie: {
      // path:"123",
      sameSite: "strict",
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://admin:pHscCtwkXMJeOCII@hshlove.5qisl3o.mongodb.net/HSHLove-Session",
      autoRemove: "native",
    }),
  })
);

app.use("/", routes);
app.use("/", matchRoutes);

/* startet den Sever*/
httpServer.listen(port, () => {
  console.log("Server succesfully startet at Port : " + port);
}); 

/* alle öffentlichen Routen*/
const public_routes = ["/login", "/signup"];

app.use(function (req, res, next) {
  if (req.session.user) {
    res.cookie("loggedIn", true);
  } else {
    res.cookie("loggedIn", false);
  }
  next();
});

/* wird bei jeder Server Anfrage ausgeführt*/
app.use(function (req, res, next) {
  if (public_routes.includes(req.path)) {
    return next();
  }
  next();
});

/* holt den username aus der Datenbank*/
app.get("/getUsername", (req, res) => {
  database.findUsernameByToken(req.token).then((user) => {
    userNameObj = { name: user.name };
    res.send(userNameObj);
  });
});

/* checkt, ob user eingeloggt ist oder nicht & holt den user */
app.get("/getUser", (req, res) => {
  if (req.session.authorized) {
    res.send(req.session.user);
  } else {
    res.send({ loggedIn: false });
  }
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.post("/uploadImage", upload.single("image"), (req, res) => {
  console.log(req.file); // the uploaded file object
  // log request type

  /*
  New File muss am besten so aussehen.
  newFile = {
      fieldname: req.file.fieldname,
      originalname: uId + "_" + imgNr.toString() + ".jpeg",
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
      size: req.file.size
  }*/
  var newName = makeid(20) + ".jpeg";
  var image = {
    ...req.file,
    originalname: newName,
  };

  uploadChatImage(image);
  setTimeout(() => {
    res.send({
      status: "success",
      text: newName,
    });
  }, 1000);
});

chat.serverInitialisieren(httpServer);
