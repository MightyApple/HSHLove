const express = require('express')
//const database = require('./database.js'); mongoHSHLove sollte ausreichen
const path = require("path")
const bcrypt = require("bcrypt")
const mongoHSHLove = require("../mongodb")
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const {addLikedUser} = require("../database");

const router = express.Router();

router.post("/getProfile", async (req, res) => {
    try {
        const email = "test@test.mail.de";
        const user = await mongoHSHLove.userDataCollection.findOne({
            email: email,
        })
        console.log("!_----------_!")
        console.log(user.degree)

        const degree = await mongoHSHLove.courseCollection.findOne({
            _id: user.degree,
        })

        let tags = [];
        for (let i in user.tags) {
            tags.push(await mongoHSHLove.tagCollection.findOne({
                _id: user.tags[i],
            }) )
        }
        console.log(tags)

        req.session.currentUser = user;
        req.session.currentDegree = degree;
        req.session.currentTags = tags;

        res.json({data:req.session.currentUser, degree:req.session.currentDegree, tag:req.session.currentTags})

    } catch (e) {
        console.log(e)
        res.status(500).send("something broke in the registration")
    }
})

router.post("/likeProfile", async (req, res) => {
    try {
        const data = req.body;
        console.log("data: " + data._id);
        console.log("data2: " + data.currentUserId);

        const filter = { _id: data.currentUserId };
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

        const match = await addLikedUser(data.currentUserId, data._id);

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


router.post("/dislikeProfile", async (req, res) => {
    try {
        const data = req.body;
        console.log("data: " + data._id);
        console.log("data2: " + data.currentUserId);

        const filter = { _id: data.currentUserId };
        const user = await mongoHSHLove.userDataCollection.findOne(filter);

        // Überprüfen, ob der Wert bereits im Array vorhanden ist
        if (user && user.disliked.includes(data._id)) {
            console.log("Der Wert ist bereits im Array vorhanden.");
            res.send({ noError: true });
            return;
        }

        const update = {
            $push: { disliked: data._id }
        };

        const result = await mongoHSHLove.userDataCollection.updateOne(filter, update);
        console.log(result);

        res.send({
            noError: true,
        });
        console.log("Schau in die DB");

    } catch (e) {
        console.log(e);
        res.status(500).send("Something broke in the registration");
    }
});


router.post("/getTags", async (req, res) => {
    try {
        const user = await mongoHSHLove.tagCollection.find({});
        console.log(user)

        req.session.currentUser = user;

        res.json({data:req.session.currentUser})

    } catch (e) {
        console.log(e)
        res.status(500).send("something broke in the registration")
    }
})

router.post("/getDegree", async (req, res) => {
    try {
        const user = await mongoHSHLove.courseCollection.find({});
        console.log("Studiengänge")
        console.log(user)

        req.session.currentUser = user;

        res.json({data:req.session.currentUser})

    } catch (e) {
        console.log(e)
        res.status(500).send("something broke in the registration")
    }
})


module.exports = {
    router,
}