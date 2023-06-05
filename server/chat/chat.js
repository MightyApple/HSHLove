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

const onlineUsers = {};
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

    function getChats(socket) {
        database.getChats(socket._id).then((chats) => {
            var users = [];
            var messages = [];
            chats.forEach((chat) => {
                var otherUser = chat.users.find((user) => user._id != socket._id); //findet den anderen user in dem chatroom welcher nicht der client ist
                users.push({
                    userId: otherUser._id,
                    username: otherUser.email, // TODO: wenns in der DB ist, dann otherUser.username
                });

                chat.messageHistory.forEach((message) => {
                    messages.push({
                        receiverId: otherUser._id,
                        sender: message.sentByUserID.email, // TODO: wenns in der DB ist, dann message.sendByUserID.username
                        content: message.messageContent,
                        timestamp: message.timeStamp
                    });
                });

            });

            socket.emit("initChats", {
                users,
                messages
            });
        });
    }

    io.on("connection", (socket) => { //wird ausgeführt, wenn ein client connected
        io.emit("User connected", socket._id);
        onlineUsers[socket._id] = socket;
        console.log(socket.id); //gibt id des sockets aus

        // get chatRoomId from db where socket.receiverId == user1ID
        getChats(socket);

        saveSession(socket.sessionID, {
            userId: socket._id,
            username: socket.username,
            connected: true,
        });

        console.log("Joining room: " + socket._id);
        socket.join(socket._id); //fügt den socket zu einem room hinzu

        socket.on("message", ({ content, to }) => { //wird ausgeführt, wenn ein client eine private message/bilder sendet
            console.log("private message received: " + content + " from " + socket._id + " to " + to);
            var timestamp = new Date().toLocaleString();
            io.to(to).to(socket._id).emit("message", {
                content,
                from: socket.email, //TODO: wenns in der DB ist, dann socket.username
                receiverId: to,
                timestamp: timestamp,
            });

            database.getChat(socket._id, to).then((chat) => {
                var chatID = chat._id;
                database.saveChatMessage(chatID, socket._id, content, timestamp);
            });
        });

        socket.on("newMatch", async ({ matchId }) => {
            console.log("new match received");
            // match chatroom zum client hinzufügen
            var otherUser = await database.findUserByID(matchId);
            socket.emit("newMatch", {
                userId: otherUser._id,
                username: otherUser.email, // TODO: wenns in der DB ist, dann otherUser.username
            });

            // match chatroom zum anderen user hinzufügen
            socket.to(matchId).emit("newMatch", {
                userId: socket._id,
                username: socket.email, // TODO: wenns in der DB ist, dann socket.username
            });
        });

        socket.on('disconnect', () => { //wird ausgeführt, wenn ein client disconnected
            console.log("User disconnected");
            delete onlineUsers[socket._id];
            socket.broadcast.emit('User disconnected', socket.userId); //sendet an alle außer an den, der disconnected
        })
    });
}

module.exports = { //exportiert Sachen vgl. in Java wirds "public"
    serverInitialisieren,
}