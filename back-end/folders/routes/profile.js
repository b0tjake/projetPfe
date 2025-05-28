const express = require('express');
const { middleWare } = require('../middleWare/profilemiddleware');
const user = require('../models/user');
const posts = require('../models/post');  
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'profilePics')
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + '-' + file.originalname)
    },

})
const upload = multer({storage:storage})


const app = express()


app.get('/profile/:id', async (req, res) => {
    try{
        const User = await user.findOne({_id : req.params.id}).select("-password")
        const post = await posts.find({user : req.params.id})
        res.status(200).json({message : "User found", user : User , posts : post})
    }
    catch (err) {
        console.log("Couldn't find user", err);
        res.status(400).json({ message: "Couldn't find user" });
    }
})

app.put('/saveChanges/:id' , async (req,res) => {
    const {bio,city,phone,profession} = req.body
    try{
        const User = await user.findByIdAndUpdate(req.params.id,{bio,city,phone,profession} , {new:true})
        res.status(200).json({message : "changes are saved", user : User})
    }
    catch (err) {
        console.log("Couldn't update user", err);
        res.status(400).json({ message: "Couldn't update user" });
    }

})
app.put('/editPhoto/:id', upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
  
      const updatePhoto = await user.findByIdAndUpdate(req.params.id,{ image: req.file.path },{ new: true });
  
      res.status(200).json({
        message: "Changes are saved",
        user: updatePhoto,
        image: req.file.path
      });
  
    } catch (err) {
      console.log("Couldn't update user", err);
      res.status(400).json({ message: `Couldn't update user ${err}` });
    }
  });

app.put('/updateInfo/:id', async (req, res) => {
    const { fullname, username, email } = req.body;
    try {
        // Check if username or email already exists for another user
        const existingUsername = await user.findOne({ username, _id: { $ne: req.params.id } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const existingEmail = await user.findOne({ email, _id: { $ne: req.params.id } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            { fullname, username, email },
            { new: true }
        );
        res.status(200).json({ message: 'User info updated', user: updatedUser });
    } catch (err) {
        console.log("Couldn't update user info", err);
        res.status(400).json({ message: "Couldn't update user info" });
    }
});

app.put('/updatePassword/:id', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    try {
        const foundUser = await user.findById(req.params.id);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (foundUser.password !== currentPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }
        foundUser.password = newPassword;
        await foundUser.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log("Couldn't update password", err);
        res.status(400).json({ message: "Couldn't update password" });
    }
});
  
module.exports = app
