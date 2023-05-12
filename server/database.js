const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://Aylin:Aylin@hshlove.5qisl3o.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();

        const db = client.db("HSHLove");
        const collection = db.collection("nutzerkonto");
        // const newUser = { name: "Max", profilBeschreibung: "Hello World" };

        //     collection.insertOne(newUser, (err, res) => {
        //     if (err) throw err;
        //     console.log("1 Eintrag hinzugefügt");
        //    });
        // collection.deleteMany({ name: "Max" }, function(err, obj) {});
        const foundUser = await findUser("Beispielname Max", "Gehashtes Passwort");
        console.log(foundUser);
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
}
async function findUser(username, password) {
    try {
        const user = await client.db("HSHLove").collection("nutzerkonto").findOne({ name: username, passwort: password });
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const userObj = { name: user.name, token: user.token };

        return userObj;
    } catch (error) {
        console.log(error);
    }
}

async function findUserByToken(token) {
    try {
        const user = await client.db("HSHLove").collection("nutzerkonto").findOne({ token });
        if (!user) {
            throw new Error('Invalid token');
        }

        const userObj = { name: user.name };

        return userObj;
    } catch (error) {
        console.log(error);
    }
}
// }
main().catch(console.error);

module.exports = { findUser, findUserByToken };