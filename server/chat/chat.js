const { Server } = require("socket.io");
const { saveSession, findSession } = require("./sessionStorage.js");
const database = require("../database.js");

/** erstellt einen socketio server aus einem http server */
function serverInitialisieren(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  chatInitialisieren(io);
}

/** fügt den socket zu den Chatrooms hinzu, die den user haben */
function joinChatRooms(socket) {
  db.getAllUserChatRooms(socket.userId).then((chatRooms) => {
    chatRooms.forEach((chatRoom) => {
      socket.join(chatRoom._id);
    });
  });
}

const onlineUsers = {};

/** initialisiert den Chat */
function chatInitialisieren(io) {
  /** Middleware wird vor dem connection event ausgeführt */
  io.use((socket, next) => {
    for (const key in socket.handshake.auth) {
      /** fügt die Daten aus dem auth object dem socket hinzu*/
      if (Object.hasOwnProperty.call(socket.handshake.auth, key)) {
        const value = socket.handshake.auth[key];
        socket[key] = value;
      }
    }

    next();
  });

  function getChats(socket) {
    database.getChats(socket._id).then((chats) => {
      var users = [];
      var chatRooms = [];
      chats.forEach((chat) => {
        /** findet den anderen user im chatroom*/
        var otherUser = chat.users.find((user) => user._id != socket._id);
        /* fügt den anderen user der user Liste hinzu*/
        users.push({
          userId: otherUser._id,
          username: otherUser.name,
          profileImage: otherUser.images[0],
        });

        var messages = [];
        chat.messageHistory.forEach((message) => {
          messages.push({
            receiverId: otherUser._id,
            receiverImage: message.sentByUserID.images[0],
            sender: message.sentByUserID._id,
            content: message.messageContent,
            timestamp: message.timeStamp,
            isImage: message.isImage,
          });
        });
        /** fügt den Chatroom der chatRooms Liste hinzu*/
        chatRooms.push({
          id: chat._id,
          users: chat.users,
          messages: messages,
        });
      });

      var onlineUserIDs = [];
      /** geht durch alle online users und fügt die IDs der onlineUserIDs Liste hinzu*/
      for (const key in onlineUsers) {
        if (Object.hasOwnProperty.call(onlineUsers, key)) {
          const user = onlineUsers[key];
          onlineUserIDs.push(user._id);
        }
      }
      /** sendet alle Daten zum Chat an den Client*/
      socket.emit("initChats", {
        users,
        chatRooms,
        onlineUsers: onlineUserIDs,
      });
    });
  }

  /** wird ausgeführt wenn ein Client connected*/
  io.on("connection", (socket) => {
    io.emit("User connected", socket._id);
    onlineUsers[socket._id] = socket;

    getChats(socket);

    saveSession(socket.sessionID, {
      userId: socket._id,
      username: socket.username,
      connected: true,
    });

    socket.join(socket._id); //fügt den socket zu einem room hinzu

    /** wird ausgeführt, wenn ein Client eine Nachricht sendet*/
    socket.on("message", ({ content, to }) => {
      var timestamp = new Date().toLocaleString();

      /** holt den Chat zwischen Sender und Emfpänger*/
      database.getChat(socket._id, to).then((chat) => {
        var chatID = chat._id;
        /** sendet die Nachricht mit Daten an die beiden Clients*/
        io.to(to).to(socket._id).emit("message", {
          chatID: chat._id,
          content,
          sender: socket._id,
          from: socket.name,
          receiverId: to,
          timestamp: timestamp,
        });
        /** speichert die Nachricht in der Datenbank*/
        database.saveChatMessage(chatID, socket._id, content, timestamp, false);
      });
    });
    /** wird ausgeführt wenn ein Client ein Bild versendet */
    socket.on("imgMessage", ({ content, to }) => {
      var timestamp = new Date().toLocaleString();
      database.getChat(socket._id, to).then((chat) => {
        var chatID = chat._id;
        setTimeout(() => {}, 50);
        io.to(to).to(socket._id).emit("message", {
          chatID: chat._id,
          content,
          sender: socket._id,
          from: socket.name,
          receiverId: to,
          timestamp: timestamp,
          isImage: true,
        });
        database.saveChatMessage(chatID, socket._id, content, timestamp, true);
      });
    });

    /** wird ausgeführt wenn ein Match entsteht => ein neuer Chatroom wird erstellt*/
    socket.on("newMatch", async ({ matchId }) => {
      // match chatroom zum client hinzufügen
      var otherUser = await database.findUserByID(matchId);
      var chatRoom = await database.getChat(socket._id, matchId);

      /** das Match Event wird an beide Clients gesendet*/
      socket.emit("newMatch", {
        user: {
          userId: otherUser._id,
          username: otherUser.name,
        },
        chatRoom: {
          id: chatRoom._id,
          users: chatRoom.users,
          messages: [],
        },
      });
      /** stellt die Verbindung der Clients zum chatRoom her */
      socket.to(matchId).emit("newMatch", {
        user: {
          userId: socket._id,
          username: socket.name,
        },
        chatRoom: {
          id: chatRoom._id,
          users: chatRoom.users,
          messages: [],
        },
      });
    });

    /** wenn sich ein Client ausloggt, wird er aus der onlineUser Liste entfernt*/
    socket.on("disconnect", () => {
      delete onlineUsers[socket._id];
      socket.broadcast.emit("User disconnected", socket.userId); //sendet an alle außer an den, der disconnected
    });
  });
}

module.exports = {
  serverInitialisieren,
};
