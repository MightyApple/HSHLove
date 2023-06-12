const mongoose=require("mongoose")
const mongoUrl = "mongodb+srv://admin:pHscCtwkXMJeOCII@hshlove.5qisl3o.mongodb.net/HSHLove"
mongoose.connect(mongoUrl)
    .then(() => {
        console.log("mongoDB connected: " + mongoUrl);
    })
    .catch(() => {
        console.log("failed to connect to mongodb");
    })

/**
 * Chris: Ihr wollt eine neue Collection anlegen? Dann legt zuerst ein Schema an. Dies sichert ab, dass falsche
 * Einträge gesendet werden, heißt bsow. email:{type:String} => der name der property muss email heißen und nicht email2 o.ä. und es kann nur Strings aktzeptiert werden.
 * ist ein Schema angelegt fehlt noch ein model zum exportieren => schreibt diesen code : const deinNeueCollection=new mongoose.model("nameDerDatenbankCollection",deinSchema)
 * und finally in module.exports einlegen
 */

const userDataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    images: {
        type: Array
    },
    birthday: {
        type: Date
    },
    description: {
        type: String,
        default: "Das ist eine default Beschreibung"
    },
    name: {
        type: String,
        default: "Das ist ein default Name"
    },
    password: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: false
    },
    intention: [{
        type: String,
        
    }],
    gender: {
        type: String,
        
    },
    degree: {
        type: String,
        
    },
    preference: [{
        type: String,
        
    }],
    liked: {
        type: Array,
        id: {
            type: String
        }
    },
    disliked: {
        type: Array,
        id: {
            type: String
        }
    },
    tags: [{
        type: String,
    }],
    roll: {
        type: String
    }
})

const messageSchema = new mongoose.Schema({
    users: [{
        type: String,
        ref: "Nutzerdaten"
    }],
    messageHistory: [{
        messageContent: {
            type: String
        },
        timeStamp: {
            type: String,
        },
        sentByUserID: {
            type: String,
            ref: "Nutzerdaten"
        },
        isImage: {
            type: Boolean,
            default: false
        },
    }]
})

const tagSchema = new mongoose.Schema({
    name: {
        type: String
    },
})

const courseSchema = new mongoose.Schema({
    name: {
        type: String
    },
})

const userDataCollection = new mongoose.model("Nutzerdaten", userDataSchema);
const chatCollection = new mongoose.model("chatroom", messageSchema);
const tagCollection = new mongoose.model("tag", tagSchema);
const courseCollection = new mongoose.model("studiengangs", courseSchema);

module.exports = { userDataCollection, chatCollection, tagCollection, courseCollection }