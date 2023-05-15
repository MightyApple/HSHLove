const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const {saveSession, findSession} = require('./sessionStorage.js');
const mongoCollection = require("../mongodb");

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
        const sessionID = socket.handshake.auth.sessionID;
        
        if (sessionID) { //wenn session id vorhanden
            const session = findSession(sessionID); //suche nach session
            if (session) {
                socket.sessionID = session;
                socket.userId = session.userId;
                socket.username = session.username;
                return next(); //wenn session gefunden, dann weiter zur nächsten middleware
            } else {    //wenn session nicht gefunden, dann error und nächste middleware wird geskippt
                return next(new Error("invalid session"));
            }


            // const user = getUserBySessionId(sessionId);
            // if(user) {
            // socket.user = user;
            // return next();
            // }
        }
        console.log(socket.handshake.auth);
        const username = socket.handshake.auth.username; //username aus dem handshake holen (wird vom client gesendet)
        if (!username) { //wenn kein username vorhanden, dann error und nächste middleware wird geskippt
            return next(new Error("invalid username"));
        }
        socket.username = username;
        // socket.userId = uuidv4(); //wir erstellen die ID bei der Registrierung. TODO: DB Abfrage für den aktuell eingeloggten User machen
        //get UserID from DB by Token

        mongoCollection.findOne({ token: socket.handshake.auth.token }).lean().then((user) => {
            socket.userId = user.userID;
            console.log("UserID: " + socket.userId);
        });
        socket.sessionID = uuidv4();
        next();
    });

    // socket.emit("session", { //sendet an den client
    //     sessionId: socket.sessionId,
    //     userId: socket.userId,
    //     username: socket.username,
    // });

    io.on("connection", async (socket) => { //wird ausgeführt, wenn ein client connected
        saveSession(socket.sessionID, {
            userId: socket.userId,
            username: socket.username,
            connected: true,
        });

        socket.join(socket.userId); //fügt den socket zu einem room hinzu

        socket.on("private message", ({ content, to }) => { //wird ausgeführt, wenn ein client eine private message/bilder sendet
            socket.to(to).to(socket.userID).emit("private message", { 
              content,
              from: socket.userID,
              to,
            });
          });

        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: socket.userID,
          });


        io.emit("User connected", socket.userId);
        console.log(socket.id); //gibt id des sockets aus

        socket.on('disconnect', () => { //wird ausgeführt, wenn ein client disconnected
            console.log("User disconnected");
            socket.broadcast.emit('User disconnected', socket.userId); //sendet an alle außer an den, der disconnected
        })
        socket.on('message', (message) => { //wird ausgeführt, wenn ein client eine message sendet
            console.log("message received: " + message + " from " + socket.id);
            io.emit('message', {
                sender: socket.id,
                text: message,
                userId: socket.userId,
            });
        });
    });
}

module.exports = { //exportiert Sachen vgl. in Java wirds "public"
    serverInitialisieren,
}