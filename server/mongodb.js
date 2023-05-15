const mongoose=require("mongoose")
const mongoUrl = "mongodb+srv://admin:admin@hshlove.5qisl3o.mongodb.net/HSHLove"
mongoose.connect(mongoUrl)
.then(()=>{
    console.log("mongoDB connected :D : " +mongoUrl);
})
.catch(()=>{
    console.log("failed to connect to mongodb");
})

const LogInSchema=new mongoose.Schema({
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
    }
})
const nutzerdatenCollection=new mongoose.model("Nutzerdaten",LogInSchema);
module.exports=nutzerdatenCollection