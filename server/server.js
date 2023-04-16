const express = require('express')
const { createServer } = require("http");

const app = express()
const port = 3001
var chat = require('./chat/chat.js');

const httpServer = createServer(app);
httpServer.listen(port); //app.listen(3000) geht nicht! erstellt neuen http server

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/index.html');
  res.send('Hello World!')
})

chat.serverInitialisieren(httpServer);
