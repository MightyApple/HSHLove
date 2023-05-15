const mongoose=require("mongoose")
const mongoUrl = "mongodb+srv://admin:admin@hshlove.5qisl3o.mongodb.net/HSHLove"
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
        type: String
    },
    name:{
        type: String
    },
    password:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})


const tempSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const userDataCollection=new mongoose.model("Nutzerdaten",userDataSchema);
const tempCollection=new mongoose.model("temp",tempSchema);


module.exports={userDataCollection, tempCollection}