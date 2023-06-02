const express = require('express')
//const database = require('./database.js'); mongoHSHLove sollte ausreichen
const cors = require('cors');
const app = express()
const path = require("path")
const bcrypt = require("bcrypt")
const mongoHSHLove = require("../mongodb")
const session = require('express-session');
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const MongoStore = require('connect-mongo');
const {addLikedUser} = require("../database");

const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()); //damit der Client auf den Server zugreifen kann


//Session mit cookies
router.use(session({
    secret: "lol",
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:pHscCtwkXMJeOCII@hshlove.5qisl3o.mongodb.net/HSHLove-Session',
        autoRemove: 'native',
    })
}));

router.post("/getProfile", async (req, res) => {
    try {
        const email = "test@test.mail.de";
        const user = await mongoHSHLove.userDataCollection.findOne({
            email: email,
        })
        console.log(user)

        req.session.currentUser = user;

        res.json({data:req.session.currentUser})

    } catch (e) {
        console.log(e)
        res.status(500).send("something broke in the registration")
    }
})

router.post("/likeProfile", async (req, res) => {
    console.log("ANGEKOMMEN!!!!!!");
    try {
        const data = req.body;
        console.log("data: " + data._id);
        console.log("data2: " + data.myId);

        const filter = { _id: data.myId };
        const user = await mongoHSHLove.userDataCollection.findOne(filter);

        // Überprüfen, ob der Wert bereits im Array vorhanden ist
        if (user && user.liked.includes(data._id)) {
            console.log("Der Wert ist bereits im Array vorhanden.");
            res.send({ noError: true });
            return;
        }

        const update = {
            $push: { liked: data._id }
        };

        const result = await mongoHSHLove.userDataCollection.updateOne(filter, update);
        console.log(result);

        const match = await addLikedUser(data.myId, data._id);

        res.send({
            noError: true,
            match
        });
        console.log("Schau in die DB");

    } catch (e) {
        console.log(e);
        res.status(500).send("Something broke in the registration");
    }
});



module.exports = {
    router,
}