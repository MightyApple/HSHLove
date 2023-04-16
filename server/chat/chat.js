const { Server } = require("socket.io");
var io;

function serverInitialisieren(httpServer){

    const server = new Server(httpServer, {/* options */}); //erstellt socketio server aus httpServer
    io = server;
    server.on("connection", (socket) => {
        console.log("ein Nutzer hat sich verbunden");// wird ausgeführt, wenn eine Verbindung besteht
      });
      chatInitialisieren(server);
}

function chatInitialisieren(io){
    io.on("connection", (socket) => {
    console.log(socket.id); //printet die IDs der Verbindungsteilnehmer
     });
}

module.exports =  { //exportiert Sachen vgl. in Java machts "public"
    serverInitialisieren,
}