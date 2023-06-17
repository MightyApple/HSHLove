const mongoose = require("mongoose");
const { userDataCollection, chatCollection } = require("./mongodb");

/* holt Nutzer:innen mit Hilfe des Usernames und Passworts*/
async function findUser(username, password) {
  try {
    const user = await userDataCollection
      .findOne({ name: username, passwort: password })
      .lean();
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const userObj = { name: user.name, token: user.token };

    return userObj;
  } catch (error) {
    console.log(error);
  }
}

/* holt Name mit Hilfe des Tokens*/
async function findUsernameByToken(token) {
  try {
    const user = await userDataCollection.findOne({ token }).lean();
    if (!user) {
      throw new Error("Invalid token");
    }

    const userObj = { name: user.name };

    return userObj;
  } catch (error) {
    console.log(error);
  }
}

/* holt Nutzer:innen mit Hilfe des Tokens, wird aber nicht benutzt*/
async function findUserByToken(token) {
  try {
    const user = await userDataCollection.findOne({ token }).lean();
    if (!user) {
      throw new Error("Invalid token");
    }

    const userObj = user;

    return userObj;
  } catch (error) {
    console.log(error);
  }
}

/* holt Nutzer:innen mit Hilfe der ID*/
async function findUserByID(userID) {
  try {
    const user = await userDataCollection.findOne({ _id: userID }).lean();
    if (!user) {
      throw new Error("Invalid userID");
    }

    return user;
  } catch (error) {
    console.log(error);
  }
}

/* fügt Nutzer:innen in die liked Liste eines anderen Nutzers ein & checkt ob match vorliegt*/
async function addLikedUser(userID, likedUserID) {
  const match = await isMatched(likedUserID, userID);
  if (match) {
    await chatCollection.create({
      users: [userID, likedUserID],
    });
  }
  return match;
}

/* checkt ob zwei Nutzer:innen ein Match sind*/
async function isMatched(likedUserID, userID) {
  const likedUser = await userDataCollection
    .findOne({ _id: likedUserID })
    .lean();
  const match = likedUser.liked.includes(userID); //checkt ob der user in der liked liste des anderen users ist
  return match;
}

/* holt alle Chats eines Users*/
async function getChats(userID) {
  const chats = await chatCollection
    .find({ users: userID })
    .populate("users")
    .populate("messageHistory.sentByUserID")
    .lean();
  return chats;
}

/* gibt das Chat object von zwei Nutzer:innen zurück*/
async function getChat(userID, user2ID) {
  const chat = await chatCollection
    .findOne({
      users: { $all: [userID, user2ID] },
    })
    .populate("users")
    .lean();
  return chat;
}

/* speichert Nachrichten in der Datenbank*/
async function saveChatMessage(chatID, sender, content, timestamp, isImage) {
  if (!isImage) {
    return chatCollection.updateOne(
      { _id: chatID },
      {
        $push: {
          messageHistory: {
            sentByUserID: sender,
            messageContent: content,
            timeStamp: timestamp,
          },
        },
      }
    );
  } else {
    return chatCollection.updateOne(
      { _id: chatID },
      {
        $push: {
          messageHistory: {
            sentByUserID: sender,
            messageContent: content,
            timeStamp: timestamp,
            isImage: true,
          },
        },
      }
    );
  }
}

module.exports = {
  findUser,
  findUsernameByToken,
  findUserByToken,
  findUserByID,
  addLikedUser,
  isMatched,
  getChats,
  saveChatMessage,
  getChat,
};
