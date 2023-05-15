const express = require("express")
const path = require("path")
const bcrypt = require("bcrypt")
const tempaltePath = path.join(__dirname, './template')
const mongoCollection = require("../mongodb")
const session = require('express-session');
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const src = path.join(__dirname, "template");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
router.use(express.static(src));
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.use(session({
    secret: 'secret;*',
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
    }
}));

router.get("/", (req, res) => {
    if (req.session.authorized) {
        res.render('home', { email: req.session.user.email })
    } else {
        res.render("login")
    }
})

router.get("/signup", (req, res) => {
    res.render("signup")
})
router.get("/login", (req, res) => {
    res.render("login")
})
router.get("/personalSpace", async (req, res) => {
    if (!req.session.authorized) {
        res.render("login")
    } else {
        let user = await mongoCollection.findOne({
            email: req.session.user.email,
        })
        res.render("profil", user)
    }
})

router.post("/signup", async (req, res) => {
    try {
        const { email, password, passwordwdh } = req.body;
        console.log(email, password, passwordwdh);
        const user = await mongoCollection.findOne({
            email: email,
        })

        if (!user && password == passwordwdh) {
            bcrypt.hash(password, 10, function (err, hash) {
                const data = {
                    userID: uuidv4(),
                    email: email,
                    password: hash
                }

                mongoCollection.insertMany([data]);
            })

            
            req.session.user = user;
            req.session.authorized = true;
            //alles nach der eingabe in die datenbank wird hiernach ausgeführt
            res.json({ status: "Success", redirect: '/home' });
        } else {
            //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
            res.status(500).send("ERROR");
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("something broke in the registration")
    }
})
//TODO personalspace daten ändern und abfragen




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await mongoCollection.findOne({
            email: email,
        })
        if (user) {
            const validPass = await bcrypt.compare(password, user.password)
            if (validPass) {
                //falls die daten stimmen wird der codeblock ausgeführt
                // session wird angelegt
                req.session.user = user;
                req.session.authorized = true;
                res.render("home")
            } else {
                //und falls nicht dieser
                res.send("wrong password")
            }
        }
    }
    catch {
        res.send("wrong details")
    }


})


const gc = new Storage({
    keyFilename: path.join(__dirname, "./config/hshloveKey.json"),
    projectId: 'hshlove'
})
const profilbilder = gc.bucket('profilbilder')

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
});

router.get("/upload", async (req, res) => {
    try {
        const [files] = await profilbilder.getFiles();
        res.send([files]);
        console.log("Success");
    } catch (error) {
        res.send("Error:" + error);
    }
});

router.post("/personalSpace", multer.any("imgfile"), async (req, res) => {
    try {
        let newFile
        let imgNr;
        const uId = req.session.user._id
        const { name, birthday, description, password } = req.body;
        console.log(req.file)
        console.log(req.body)
        const user = await mongoCollection.findOne({
            _id: uId,
        })
        const validPass = await bcrypt.compare(password, user.password)

        if (user && validPass) {
            try {

                //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
                if (user.toJSON().images.length === 0) {
                    imgNr = 1
                } else {
                    imgNr = (parseInt(user.toJSON().images[user.toJSON().images.length - 1].split("_").pop().split(".")[0]) + 1)
                }

                if (req.file) {
                    newFile = {
                        fieldname: req.file.fieldname,
                        originalname: uId + "_" + imgNr.toString() + ".jpeg",
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        buffer: req.file.buffer,
                        size: req.file.size
                    }

                    const blob = profilbilder.file(newFile.originalname);
                    const blobStream = blob.createWriteStream();

                    blobStream.end(newFile.buffer);

                } else {

                    throw "error with img";
                }
            } catch (error) {

                // res.status(500).send(error);
            }
            try {

                const data = {
                    name: name,
                    birthday: birthday,
                    description: description,
                }
                await mongoCollection.findOneAndUpdate({ "_id": uId }, { $set: data, $push: { images: newFile.originalname } })

                const danach = await mongoCollection.findOne({
                    _id: uId
                })

                //res.status(200).send("Success");
            } catch (error) {

                //res.status(500).send(error);
            }
            res.render("home")
        } else {
            //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
            //res.status(500).send("ERROR");
        }
    } catch (e) {
        console.log(e)

    }
})

module.exports = router;