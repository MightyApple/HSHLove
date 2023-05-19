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

        for (const key in socket.handshake.auth) { //fügt die daten aus dem auth object dem socket hinzu
            if (Object.hasOwnProperty.call(socket.handshake.auth, key)) { //wenn das object die Attribut hat
                const value = socket.handshake.auth[key]; //dann wird das Attribut dem socket hinzugefügt
                socket[key] = value;
            }
        }

        next();
    });

    function listingAllUsers(socket) {
        const users = []; //array mit allen usern
        for (let [id, socket] of io.of("/").sockets) {
            users.push({ //fügt den usernamen und die id dem array hinzu
                userID: socket._id,
                username: socket.username,
            });
        }
        socket.emit("users", users); //sendet das array an den client
    }

    io.on("connection", (socket) => { //wird ausgeführt, wenn ein client connected
        io.emit("User connected", socket._id);
        console.log(socket.id); //gibt id des sockets aus

        // get chatRoomId from db where socket.receiverId == user1ID

        listingAllUsers(socket);

        saveSession(socket.sessionID, {
            userId: socket._id,
            username: socket.username,
            connected: true,
        });

        console.log("Joining room: " + socket._id);
        socket.join(socket._id); //fügt den socket zu einem room hinzu

        socket.on("message", ({ content, to }) => { //wird ausgeführt, wenn ein client eine private message/bilder sendet
            console.log("private message received: " + content + " from " + socket._id + " to " + to);
            io.to(to).to(socket._id).emit("message", {
                content,
                from: socket._id,
                to,
            });
        });

        // socket.on('message', (message) => { //wird ausgeführt, wenn ein client eine message sendet
        //     console.log("message received: " + message + " from " + socket.id);
        //     io.emit('message', {
        //         sender: socket.id,
        //         text: message,
        //         userId: socket._id
        //     });
        // });

        socket.on('disconnect', () => { //wird ausgeführt, wenn ein client disconnected
            console.log("User disconnected");
            socket.broadcast.emit('User disconnected', socket.userId); //sendet an alle außer an den, der disconnected
        })
    });
}

module.exports = { //exportiert Sachen vgl. in Java wirds "public"
    serverInitialisieren,
}