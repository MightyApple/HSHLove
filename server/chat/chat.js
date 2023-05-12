const { v4: uuidv4 } = require('uuid');
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

    io.use((socket, next) => {  //middleware, die vor jedem connection event ausgeführt werden sollte
        const sessionId = socket.handshake.auth.sessionId;
        if (sessionId) { //wenn session id vorhanden
            const session = null; //TODO: Session öffnen und in session speichern
            if (session) {
                socket.session = session;
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
        socket.userId = uuidv4();
        socket.sessionId = uuidv4();
    });

    // socket.emit("session", { //sendet an den client
    //     sessionId: socket.sessionId,
    //     userId: socket.userId,
    //     username: socket.username,
    // });

    io.on("connection", (socket) => { //wird ausgeführt, wenn ein client connected
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
                text: message
            });
        });
    });
}

module.exports = { //exportiert Sachen vgl. in Java wirds "public"
    serverInitialisieren,
}