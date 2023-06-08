const express = require('express')
//const database = require('./database.js'); mongoHSHLove sollte ausreichen
const mongoHSHLove = require("../mongodb")
const {addLikedUser, findUserByID} = require("../database");

const router = express.Router();

router.post("/getProfile", async (req, res) => {
    try {
        const data = req.body;
        const user = await mongoHSHLove.userDataCollection.findOne({
            _id: data.currentUserId,
        });

        // Zuerst finden Sie alle Benutzer
        const users = await mongoHSHLove.userDataCollection.find();

        const matchCounts = [];
        const newUsers = [];
        const usersToSkip = [user._id.toString()];

        for (const like of user.liked) {
            usersToSkip.push(like)
        }

        for (const dislike of user.disliked) {
            usersToSkip.push(dislike)
        }

        console.log("usersToSkip")
        console.log(usersToSkip)

        for (const aUser of users) {
            if (usersToSkip.includes(aUser._id.toString())) {
                continue; // Benutzer überspringen und mit der nächsten Iteration fortfahren
            }

            newUsers.push(aUser)

            let matchCount = 0;
            for (const tagId of aUser.tags) {
                // Prüfen Sie, ob der Tag des Benutzers in der gewünschten Tagliste vorhanden ist
                if (user.tags.includes(tagId)) {
                    matchCount++;
                }
            }
            matchCounts.push(matchCount);
        }
        console.log("matchCounts")
        console.log(newUsers)

// Den Benutzer mit den meisten Übereinstimmungen finden
        const maxMatchCount = Math.max(...matchCounts);
        let userWithMostMatches = newUsers[matchCounts.indexOf(maxMatchCount)];

// Der Benutzer mit den meisten Übereinstimmungen ist userWithMostMatches
        console.log("userWithMostMatches");
        console.log(userWithMostMatches);

        if (!userWithMostMatches) {
            userWithMostMatches = user.disliked[0];

            await mongoHSHLove.userDataCollection.updateMany(
                {},
                { $unset: { disliked: "" } }
            );
        }

        const degree = await mongoHSHLove.courseCollection.findOne({
            _id: userWithMostMatches.degree,
        });

        //Hole dir alle Tags des aktuellen Users
        let tags = [];
        for (let i in userWithMostMatches.tags) {
            tags.push(
                await mongoHSHLove.tagCollection.findOne({
                    _id: userWithMostMatches.tags[i],
                })
            );
        }

        req.session.currentUser = userWithMostMatches;
        req.session.currentDegree = degree;
        req.session.currentTags = tags;

        res.json({
            data: req.session.currentUser,
            degree: req.session.currentDegree,
            tag: req.session.currentTags,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("something broke in the registration");
    }
});

router.post("/likeProfile", async (req, res) => {
    try {
        const data = req.body;
        //console.log("data: " + data._id);
        //console.log("data2: " + data.currentUserId);

        const filter = { _id: data.currentUserId };
        const user = await mongoHSHLove.userDataCollection.findOne(filter);

        // Überprüfen, ob der Wert bereits im Array vorhanden ist
        if (user && user.liked.includes(data._id)) {
            //console.log("Der Wert ist bereits im Array vorhanden.");
            res.send({ noError: true });
            return;
        }

        const update = {
            $push: { liked: data._id }
        };

        const result = await mongoHSHLove.userDataCollection.updateOne(filter, update);
        //console.log(result);

        const match = await addLikedUser(data.currentUserId, data._id);

        res.send({
            noError: true,
            match
        });
        //console.log("Schau in die DB");

    } catch (e) {
        console.log(e);
        res.status(500).send("Something broke in the registration");
    }
});


router.post("/dislikeProfile", async (req, res) => {
    try {
        const data = req.body;
        //console.log("data: " + data._id);
        //console.log("data2: " + data.currentUserId);

        const filter = { _id: data.currentUserId };
        const user = await mongoHSHLove.userDataCollection.findOne(filter);

        // Überprüfen, ob der Wert bereits im Array vorhanden ist
        if (user && user.disliked.includes(data._id)) {
            //console.log("Der Wert ist bereits im Array vorhanden.");
            res.send({ noError: true });
            return;
        }

        const update = {
            $push: { disliked: data._id }
        };

        const result = await mongoHSHLove.userDataCollection.updateOne(filter, update);
        //console.log(result);

        res.send({
            noError: true,
        });
        //console.log("Schau in die DB");

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
        //console.log("Studiengänge")
        //console.log(user)

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