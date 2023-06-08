const mongoose=require("mongoose");
const { userDataCollection, chatCollection } = require("./mongodb");

async function findUser(username, password) {
    try {
        const user = await userDataCollection.findOne({ name: username, passwort: password }).lean();
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const userObj = { name: user.name, token: user.token };

        return userObj;
    } catch (error) {
        console.log(error);
    }
}

async function findUsernameByToken(token) {
    try {
        const user = await userDataCollection.findOne({ token }).lean();
        if (!user) {
            throw new Error('Invalid token');
        }

        const userObj = { name: user.name };

        return userObj;
    } catch (error) {
        console.log(error);
    }
}

async function findUserByToken(token) {
    try {
        const user = await userDataCollection.findOne({ token }).lean();
        if (!user) {
            throw new Error('Invalid token');
        }

        const userObj = user;

        return userObj;
    } catch (error) {
        console.log(error);
    }
}

async function findUserByID(userID) {
    try {
        const user = await userDataCollection.findOne({ _id: userID }).lean();
        if (!user) {
            throw new Error('Invalid userID');
        }

        return user;
    } catch (error) {
        console.log(error);
    }
}

async function addLikedUser(userID, likedUserID) {

    const match = await isMatched(likedUserID, userID); //checkt ob der user in der liked liste des anderen users ist
    if (match) {
        // await chatCollection.insertOne({ users: [userID, likedUserID] });
        await chatCollection.create({
            users: [userID, likedUserID]
        });
    }
    return match;
}

async function isMatched(likedUserID, userID) {
    const likedUser = await userDataCollection.findOne({ _id: likedUserID }).lean();
    const match = likedUser.liked.includes(userID); //checkt ob der user in der liked liste des anderen users ist
    return match
}

async function getChats(userID) {
    // find all chats where userID is in users array & populate with users
    const chats = await chatCollection.find({ users: userID })
    .populate("users")
    .populate("messageHistory.sentByUserID")
    .lean(); 
    return chats;
}

async function getChat(userID, user2ID) {
    // find all chats where userID & user2ID are in users array
    const chat = await chatCollection.findOne({
        users: { $all: [userID, user2ID] } // $all: [userID, user2ID] -> users array beinhaltet beide userIDs
    })
    .populate("users")
    .lean();
    return chat;
}

async function saveChatMessage(chatID, sender, content, timestamp) {
    return chatCollection.updateOne({ _id: chatID }, { $push: {
        messageHistory: {
            sentByUserID: sender,
            messageContent: content,
            timeStamp: timestamp
        }
    } });
}


// chatCollection.create({ users: [
//     '6462526b27aab938ff9cc107',
//     '646671a0898c1986286eb8ec'
// ] });

module.exports = {
    findUser,
    findUsernameByToken,
    findUserByToken,
    findUserByID,
    addLikedUser,
    isMatched,
    getChats,
    saveChatMessage,
    getChat
};