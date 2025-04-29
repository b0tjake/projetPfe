const express = require('express');
const { middleWare } = require('../middleWare/profilemiddleware');
const user = require('../models/user');
const posts = require('../models/post');  




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
module.exports = app
