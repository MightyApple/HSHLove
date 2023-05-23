const express = require('express')
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const database = require('./database.js');
const cors = require('cors');
const app = express();
const path = require("path");
const src = path.join(__dirname, "template");



app.use(express.static(src));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //damit der Client auf den Server zugreifen kann

const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001
var chat = require('./chat/chat.js');
var { router:routes, requireAuth } = require('./logReg/logReg.js');
app.use('/', routes);
const { env } = require('process');

const httpServer = createServer(app);
httpServer.listen(port,()=>{
  console.log("Server succesfully startet at Port : "+port)
}); //app.listen(3000) geht nicht! erstellt neuen http server

//alle routen, die nicht authentifiziert werden müssen
const public_routes = [
  '/login',
  '/signup'
];

app.use(function (req, res, next) {
  // check if session exists
  if (req.session.user) {
    res.cookie('loggedIn', true);
  } else {
    res.cookie('loggedIn', false);
  }
  next();
});

app.use(function (req, res, next) { //middleware, die vor jedem request ausgeführt wird
  if (public_routes.includes(req.path)) { //wenn die route in der liste der public routes ist, dann wird die nächste middleware ausgeführt
    return next();
  }

  // requireAuth(req, res, next); //wenn die route nicht in der liste der public routes ist, dann wird die authentifizierung ausgeführt

  next();
});

// app.use(function (req, res, next) { //middleware, die vor jedem request ausgeführt wird
//   req.username = getUsernameByToken(req.token);
//   next();
// });

app.get('/getUsername', (req, res) => {
  database.findUsernameByToken(req.token).then((user) => { //nachdem der Eintrag gefunden wurde, senden wir den Usernamen zurück an den Client
    console.log(user.name);
    userNameObj = { name: user.name };
    res.send(userNameObj); //sendet den usernamen an den client
  }
  );
})

app.get('/getUser', (req, res) => {
  console.log(req.session.user);
  res.send(req.session.user);
});

chat.serverInitialisieren(httpServer);
