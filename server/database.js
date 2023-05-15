const { userDataCollection, tempCollection } = require("./mongodb");

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

module.exports = { findUser, findUsernameByToken, findUserByToken };