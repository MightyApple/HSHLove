const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/HSHLove")
.then(()=>{
    console.log("mongoDB connected");
})
.catch(()=>{
    console.log("failed to conenct to mongodb");
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
const nutzerdatenCollection=new mongoose.model("Nutzerdaten",LogInSchema);
module.exports=nutzerdatenCollection