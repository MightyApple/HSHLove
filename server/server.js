const express = require('express')
const { createServer } = require("http");

const app = express()
const port = 3001
var dt = require('./chat/chat.js');

const httpServer = createServer(app);
httpServer.listen(port); //app.listen(300) geht nicht! erstellt neuen http server

app.get('/', (req, res) => {
  res.send('Hello World!')
})

dt.serverInitialisieren(httpServer);