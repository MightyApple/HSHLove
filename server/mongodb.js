const mongoose=require("mongoose")
const mongoUrl = "mongodb+srv://admin:pHscCtwkXMJeOCII@hshlove.5qisl3o.mongodb.net/HSHLove"
mongoose.connect(mongoUrl)
.then(()=>{
    console.log("mongoDB connected: " +mongoUrl);
})
.catch(()=>{
    console.log("failed to connect to mongodb");
})

/**
 * Chris: Ihr wollte eine neue Collection anlegen? Dann legt zuerst ein Schema an. Dies sichert ab, dass falsche
 * einträge gesendet werden, heißt am bsp email:{type:String} => der name der property muss email heißen und nicht email2 o.ä. und es kann nur Strings aktzeptiert werden.
 * 
 * ist ein Schema angelegt fehlt noch ein model zum exportieren => schreibt diesen code : const deinNeueCollection=new mongoose.model("nameDerDatenbankCollection",deinSchema)
 * 
 * und finally in module.exports einlegen
 */

const userDataSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
        
    },
    images:{
        type:Array
    },
    birthday:{
        type:Date
    },
    description:{
        type: String,
        default:"Das ist eine default Beschreibung"
    },
    name:{
        type: String,
        default:"Das ist ein default Name"
    },
    password:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:false
    },
    intention:{
        type: String,
        enum: ["One-Night-Stand","Beziehung","Offenes"],
    },
    gender:{
        type:String,
        enum: ["männlich","weiblich","divers"]
    },
    degree:{
        type:String,
        enum:["Angewandte Informatik und soziale Medien"]
    },
    preference:{
        type:String,
        enum:["Hetero","Bisexuell","Gay","Lesbisch"]
    },
    liked:{
        type:Array,
        id:{
            type:String
        }
    },
    tags:{
        type:String,
        enum:["Ich kenne noch nicht alle Tags die eingebunden werden müssen"]
    }
})

const messageSchema=new mongoose.Schema({
    // user1ID:{
    //     type:String,
    //     required:true
    // },
    // user2ID:{
    //     type:String,
    //     required:true
    // },
    users:{
        type:Array,
        userID:{
            // type: mongoose.Types.ObjectId,
            type:String,
        }
    },
    messageHistory:{
        type:Array,
        message:{
            type:Object,
            messageContent:{
                type:String
            },
            timeStamp:{
                type:Date,
            },
            sentByUserID:{
                type:String
            }
        }
    }
})

const userDataCollection=new mongoose.model("Nutzerdaten",userDataSchema);
const chatCollection=new mongoose.model("chatroom",messageSchema);

module.exports={userDataCollection, chatCollection}