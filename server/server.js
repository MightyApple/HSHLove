const express = require('express')
const { createServer } = require("http");
const database = require('./database.js');
const cors = require('cors');
const app = express()
app.use(cors()); //damit der Client auf den Server zugreifen kann

const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001
var chat = require('./chat/chat.js');
const { env } = require('process');

const httpServer = createServer(app);
httpServer.listen(port); //app.listen(3000) geht nicht! erstellt neuen http server

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getUsername', (req, res) => {
  database.findUserByToken("token123").then((user) => { //nachdem der Eintrag gefunden wurde, senden wir den Usernamen zurück an den Client
    console.log(user.name);
    userNameObj = {name: user.name};
    res.send(userNameObj); //sendet den usernamen an den client
  }
  );
})

chat.serverInitialisieren(httpServer);
