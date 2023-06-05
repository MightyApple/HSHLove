const express = require('express')
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const cors = require('cors');
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const database = require('./database.js');
const chat = require('./chat/chat.js');
const { router:routes, requireAuth } = require('./logReg/logReg.js');
const { router:matchRoutes } = require('./matchPage/matchPage.js');

const app = express();
const httpServer = createServer(app);
const src = path.join(__dirname, "template");
const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001


app.use(express.static(src));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //damit der Client auf den Server zugreifen kann

//Session mit cookies
app.use(session({
  secret: "lol",
  resave: true,
  saveUninitialized: true,
  cookie: {
      sameSite: 'strict',
  },
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://admin:pHscCtwkXMJeOCII@hshlove.5qisl3o.mongodb.net/HSHLove-Session',
      autoRemove: 'native',
  })
}));

app.use('/', routes);
app.use('/', matchRoutes);


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
