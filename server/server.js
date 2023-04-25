const express = require('express')
const { createServer } = require("http");

const app = express()
const port = process.env.PORT || 3001 //nimmt den Port aus der Umgebungsvariablen oder 3001
var chat = require('./chat/chat.js');
const { env } = require('process');

const httpServer = createServer(app);
httpServer.listen(port); //app.listen(3000) geht nicht! erstellt neuen http server

app.get('/', (req, res) => {
  res.send('Hello World!')
})

chat.serverInitialisieren(httpServer);
