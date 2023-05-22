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

async function addLikedUser(userID, likedUserID) {

    // TODO: like user

    const match = await isMatched(likedUserID, userID); //checkt ob der user in der liked liste des anderen users ist
    if (match) {
        // await chatCollection.insertOne({ users: [userID, likedUserID] });
        await chatCollection.create({ users: [userID, likedUserID] });
        //openChat();
    }
    return match;
}


async function isMatched(likedUserID, userID) {
    const likedUser = await userDataCollection.findOne({ _id: likedUserID }).lean();
    const match = likedUser.likes.includes(userID); //checkt ob der user in der liked liste des anderen users ist
    return match
}

async function getChats(userID) {
    // find all chats where userID is in users array & populate with users
    //TODO: gucken ob populate funktioniert
    const chats = await chatCollection.find({ users: userID }).populate("users").lean();
    // const chats = await chatCollection.find({ users: userID }).lean();
    return chats;
}

// chatCollection.create({ users: [
//     "6462526b27aab938ff9cc107",
//     "646671a0898c1986286eb8ec"
// ] });

module.exports = {
    findUser,
    findUsernameByToken,
    findUserByToken,
    addLikedUser,
    isMatched,
    getChats
};