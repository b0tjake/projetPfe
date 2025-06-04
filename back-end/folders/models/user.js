const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "profilePics/default.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profession: {
    type: String,
    default: "add your profession to your profile",
  },
  city: {
    type: String,
    default: "add a city where you live to your profile",
  },
  phone: {
    type: String,
    default: "add a phone number to your profile",
  },
  bio: {
    type: String,
    default: "add a BIO to your profile",
  },
  friends: [{
     type: mongoose.Schema.Types.ObjectId,
  ref: "User" 
}],

  friendRequestsSent: [{
     type: mongoose.Schema.Types.ObjectId,
  ref: "User" 
}],

  friendRequestsReceived: [{
         type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    }],
});
module.exports = mongoose.model("User", userSchema);
