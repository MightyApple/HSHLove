const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://admin:admin@hshlove.5qisl3o.mongodb.net/")
.then(()=>{
    console.log("mongoDB connected :D");
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