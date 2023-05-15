const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const { saveSession, findSession } = require('./sessionStorage.js');
const database = require('../database.js');

function serverInitialisieren(httpServer) {

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"
        }
    }); //erstellt socketio server aus httpServer
    chatInitialisieren(io);
}

function joinChatRooms(socket) {
    db.getAllUserChatRooms(socket.userId).then((chatRooms) => {
        chatRooms.forEach((chatRoom) => {
            socket.join(chatRoom._id);
        });
    }
    );
}

function chatInitialisieren(io) {

    io.use((socket, next) => {  //middleware, die vor jedem connection event ausgeführt werden sollte
        console.log('============= NEW CONNECTION =============');

        console.log(socket.handshake.auth);

        next();
    });



    io.on("connection", async (socket) => { //wird ausgeführt, wenn ein client connected
        const userId = socket.handshake.auth._id;
        io.emit("User connected", userId);
        console.log(socket.id); //gibt id des sockets aus

        saveSession(socket.sessionID, {
            userId: userId,
            username: socket.username,
            connected: true,
        });

        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: userId,
        });
        // socket.emit("session", { //sendet an den client
        //     sessionId: socket.sessionId,
        //     userId: socket.userId,
        //     username: socket.username,
        // });

        socket.join(userId); //fügt den socket zu einem room hinzu

        socket.on("private message", ({ content, to }) => { //wird ausgeführt, wenn ein client eine private message/bilder sendet
            socket.to(to).to(userId).emit("private message", {
                content,
                from: userId,
                to,
            });
        });

        socket.on('message', (message) => { //wird ausgeführt, wenn ein client eine message sendet
            console.log("message received: " + message + " from " + socket.id);
            io.emit('message', {
                sender: socket.id,
                text: message,
                userId
            });
        });

        socket.on('disconnect', () => { //wird ausgeführt, wenn ein client disconnected
            console.log("User disconnected");
            socket.broadcast.emit('User disconnected', socket.userId); //sendet an alle außer an den, der disconnected
        })
    });
}

module.exports = { //exportiert Sachen vgl. in Java wirds "public"
    serverInitialisieren,
}