const { Server } = require("socket.io");

function serverInitialisieren(httpServer) {

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"
        }
    }); //erstellt socketio server aus httpServer
    chatInitialisieren(io);
}

function chatInitialisieren(io) {

    io.on("connection", (socket) => {
        socket.broadcast.emit("User connected");
        console.log(socket.id); //printet die zufällig vergebenen IDs der Verbindungsteilnehmer TODO: muss durch die eingeloggten ACC IDs ersetzt werden

        socket.on('disconnect', () => {
            console.log("User disconnected");
            socket.broadcast.emit("User disconnected");
        })
        socket.on('message', (message) => {
            io.emit('message', {
                sender: socket.id,
                text: message
            });
        });
    });

}

module.exports = { //exportiert Sachen vgl. in Java machts "public"
    serverInitialisieren,
}