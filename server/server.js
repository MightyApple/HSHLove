const express = require('express')
const { createServer } = require("http");
const database = require('./database.js');
const cors = require('cors');
const app = express();
const path = require("path");
const src = path.join(__dirname, "template");

app.use(express.static(src));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //damit der Client auf den Server zugreifen kann

const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001
var chat = require('./chat/chat.js');
var routes = require('./logReg/index.js');
app.use('/', routes);
const { env } = require('process');

const httpServer = createServer(app);
httpServer.listen(port); //app.listen(3000) geht nicht! erstellt neuen http server

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

app.get('/getUsername', (req, res) => {
  database.findUserByToken(req.token).then((user) => { //nachdem der Eintrag gefunden wurde, senden wir den Usernamen zurück an den Client
    console.log(user.name);
    userNameObj = { name: user.name };
    res.send(userNameObj); //sendet den usernamen an den client
  }
  );
})


chat.serverInitialisieren(httpServer);