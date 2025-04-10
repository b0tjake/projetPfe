const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    image:{
        type:String,
        default : "profilePics/default.jpg"
    },
    role:{
        type:String,
        enum : ["admin","user"],
        default : "user"
    }
})
module.exports=mongoose.model("User", userSchema)