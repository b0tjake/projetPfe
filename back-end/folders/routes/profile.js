const express = require('express');
const { middleWare } = require('../middleWare/profilemiddleware');
const user = require('../models/user');


const app = express()

app.get('/profile', middleWare, async (req, res) => {
    try{
        const User = await user.findOne(req.user._id).select("-password")
        res.status(200).json({message : "User found", user : User})
    }
    catch (err) {
        console.log("Couldn't find user", err);
        res.status(400).json({ message: "Couldn't find user" });
    }
})
module.exports = app
