const { Server } = require("socket.io");

function serverInitialisieren(httpServer){

    const io = new Server(httpServer, {  cors: {
        origin: "http://localhost:3000"
      }}); //erstellt socketio server aus httpServer
    io.on("connection", (socket) => {
        console.log("ein Nutzer hat sich verbunden");// wird ausgeführt, wenn eine Verbindung besteht
      });
      chatInitialisieren(io);
}

function chatInitialisieren(io){
    io.on("connection", (socket) => {
    console.log(socket.id); //printet die zufällig vergebenen IDs der Verbindungsteilnehmer
     });
}

module.exports =  { //exportiert Sachen vgl. in Java machts "public"
    serverInitialisieren,
}