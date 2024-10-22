const express = require("express");
const mongoHSHLove = require("../mongodb");
const { addLikedUser, findUserByID } = require("../database");

const router = express.Router();

//"findUserByAdmin" bekommt einen Namen, einen Studiengang und ein Geschlecht mit. Hier wird jeder User zurückgegeben, welcher mit den Eingaben übereinstimmt.
router.post("/findUserByAdmin", async (req, res) => {
  try {
    const data = req.body;
    const query = {
      $and: [{ roll: { $ne: "Admin" } }, { roll: { $ne: "Disabled" } }],
    };
    //Wenn ein Filter angegeben wurde, wird dieser hier in query hinzugefügt
    if (data.name !== "") {
      query.$and.push({ name: { $eq: data.name } });
    }
    if (data.degree !== "all") {
      query.$and.push({ degree: { $eq: data.degree } });
    }
    if (data.gender !== "Alle") {
      query.$and.push({ gender: { $eq: data.gender } });
    }

    const users = await mongoHSHLove.userDataCollection.find(query);

    res.json({
      users: users,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

//"disableUser" stellt die Rolle eines Users auf Disabled
router.post("/disableUser", async (req, res) => {
  try {
    const data = req.body;

    await mongoHSHLove.userDataCollection.updateOne(
      { _id: data.id },
      { $set: { roll: "Disabled" } }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

//"getReportedProfile" gibt ein volles Profil zurück, welches die Admins ansehen können
router.post("/getReportedProfile", async (req, res) => {
  try {
    const data = req.body;

    const degree = await mongoHSHLove.courseCollection.findOne({
      _id: data.user.user.degree,
    });
    const tags = await mongoHSHLove.tagCollection.find({
      _id: { $in: data.user.user.tags },
    });

    res.json({
      degree: degree,
      tag: tags,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

//"getProfile" gibt einen Nutzer für den Love Algorithmus zurück. Hier wird geprüft, welcher Nutzer am besten zu dem angemeldeten Nutzer passt.
router.post("/getProfile", async (req, res) => {
  try {
    const data = req.body;
    const user = await mongoHSHLove.userDataCollection.findOne({
      _id: data.currentUserId,
    });

    //Hier werden alle Nutzer aus der DB geholt
    const users = await mongoHSHLove.userDataCollection.find();

    const matchCounts = [];
    const newUsers = [];
    const usersToSkip = [user._id.toString()];

    for (const like of user.liked) {
      usersToSkip.push(like);
    }

    for (const dislike of user.disliked) {
      usersToSkip.push(dislike);
    }

    for (const aUser of users) {
      if (aUser.roll === "Admin" || aUser.roll === "Disabled") {
        usersToSkip.push(aUser);
        continue;
      }

      let sameIntent = false;
      for (const intent of aUser.intention) {
        if (user.intention.includes(intent)) {
          sameIntent = true;
        }
      }
      if (
        usersToSkip.includes(aUser._id.toString()) ||
        !user.preference.includes(aUser.gender) ||
        !sameIntent
      ) {
        continue; //Alle Benutzer, welche nicht vorgeschlagen werden sollen werden hier übersprungen
      }

      newUsers.push(aUser);

      let matchCount = 0;
      for (const tagId of aUser.tags) {
        //Prüft, ob der Tag des Benutzers in der Tagliste vorhanden ist
        if (user.tags.includes(tagId)) {
          matchCount++;
        }
      }
      matchCounts.push(matchCount);
    }

    //Den Benutzer mit den meisten Übereinstimmungen finden
    const maxMatchCount = Math.max(...matchCounts);
    let userWithMostMatches = newUsers[matchCounts.indexOf(maxMatchCount)];

    //Der Benutzer mit den meisten Übereinstimmungen ist userWithMostMatches

    if (!userWithMostMatches && user.disliked[0] === undefined) {
      res.json({
        data: undefined,
      });
      return;
    } else if (!userWithMostMatches) {
      userWithMostMatches = user.disliked[0];

      await mongoHSHLove.userDataCollection.updateMany(
        {},
        { $unset: { disliked: "" } }
      );
    }

    const degree = await mongoHSHLove.courseCollection.findOne({
      _id: userWithMostMatches.degree,
    });

    //Holt sich alle Tags des aktuellen Users
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

//"likeProfile" wird zusammen mit einem Profil aufgerufen. Der aktuell angemeldete Nutzer bekommt dieses in seinen likes zugeordnet.
router.post("/likeProfile", async (req, res) => {
  try {
    const data = req.body;

    const filter = { _id: data.currentUserId };
    const user = await mongoHSHLove.userDataCollection.findOne(filter);

    //Überprüfen, ob die NutzerID bereits im Array vorhanden ist
    if (user && user.liked.includes(data._id)) {
      res.send({ noError: true });
      return;
    }

    const update = {
      $push: { liked: data._id },
    };

    const result = await mongoHSHLove.userDataCollection.updateOne(
      filter,
      update
    );
    const match = await addLikedUser(data.currentUserId, data._id);

    res.send({
      noError: true,
      match,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something broke in the registration");
  }
});

//"dislikeProfile" wird zusammen mit einem Profil aufgerufen. Der aktuell angemeldete Nutzer bekommt dieses in seinen dislikes zugeordnet.
router.post("/dislikeProfile", async (req, res) => {
  try {
    const data = req.body;
    const filter = { _id: data.currentUserId };
    const user = await mongoHSHLove.userDataCollection.findOne(filter);

    //Überprüfen, ob die NutzerID bereits im Array vorhanden ist
    if (user && user.disliked.includes(data._id)) {
      res.send({ noError: true });
      return;
    }

    const update = {
      $push: { disliked: data._id },
    };

    const result = await mongoHSHLove.userDataCollection.updateOne(
      filter,
      update
    );

    res.send({
      noError: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something broke in the registration");
  }
});

//"blockProfile" löscht den Chat zwischen zwei Usern und wenn data.status true ist, wird die Rolle von einem User zu Reported gewechselt
router.post("/blockProfile", async (req, res) => {
  try {
    const data = req.body;
    const currentUserId = req.session.user._id;
    const profileIdToRemove = data.user.userId;

    // Finde den Chat-Eintrag, der die beiden Benutzer enthält
    const chatEntry = await mongoHSHLove.chatCollection.findOne({
      users: { $all: [currentUserId, profileIdToRemove] },
    });

    if (data.status) {
      const profile = await mongoHSHLove.userDataCollection.findOne({
        _id: profileIdToRemove,
      });
      if (profile) {
        //Aktualisiert das Feld "roll" des Profils
        await mongoHSHLove.userDataCollection.updateOne(
          { _id: profile._id.toString() },
          { $set: { roll: "Reported" } }
        );
      }
    }

    if (chatEntry) {
      //Lösche den gefundenen Chat
      await mongoHSHLove.chatCollection.deleteOne({ _id: chatEntry._id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
});

//"getTags" gibt alle Tags eines Users zurück
router.get("/getTags", async (req, res) => {
  try {
    const user = await mongoHSHLove.tagCollection.find({});

    req.session.currentUser = user;

    res.json({ data: req.session.currentUser });
  } catch (e) {
    console.log(e);
    res.status(500).send("something broke in the /getTags");
  }
});

//"getDegree" gibt den Studiengang eines Users zurück
router.get("/getDegree", async (req, res) => {
  try {
    const user = await mongoHSHLove.courseCollection.find({});

    req.session.currentUser = user;

    res.json({ data: req.session.currentUser });
  } catch (e) {
    console.log(e);
    res.status(500).send("something broke in the /getDegree");
  }
});

//"getReportedUsers" gibt alle User mit der Rolle Reported zurück
router.get("/getReportedUsers", async (req, res) => {
  try {
    const users = await mongoHSHLove.userDataCollection.find({
      roll: "Reported",
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
});

module.exports = {
  router,
};
