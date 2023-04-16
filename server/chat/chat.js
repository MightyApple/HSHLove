const { Server } = require("socket.io");

function serverInitialisieren(httpServer){

    const io = new Server(httpServer, {/* options */});

    io.on("connection", (socket) => {
        console.log("Verbindung besteht");// wird ausgeführt, wenn eine Verbindung besteht
      });
}

module.exports =  { //exportiert Sachen vgl. Java: macht die "public"
    serverInitialisieren,
}