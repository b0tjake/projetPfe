const express = require('express');
const User = require('../models/user');
const suggestion = require('../models/suggestions');
const posts = require('../models/post');
const multer = require('multer');
const path = require('path');
const app = express();

    const storage = multer.diskStorage({
        destination : (req,file,cb) => 
            cb(null,'placesImages/'),
        filename : (req,file,cb) => 
            cb(null,Date.now() + path.extname(file.originalname))
    }

)
const upload = multer({storage})


app.post('/showUsers',async (req,res) => {

try{
    const users = await User.find({});
    if(!users) {
        res.status(400).json({message:"No users found"})
    }
    res.status(200).json({users})

}
catch(error){
    res.status(500).json({message:error.message})
}
})


app.post('/addSuggestion', upload.single('image'), async(req,res) => {  
    const {title,description,cost,upvoters,downvoters,rating} = req.body;
    const image = req.file? req.file.path:undefined;
    try{
        const newSuggestion = new suggestion({
            title,
            description,
            cost,
            upvoters,
            downvoters,
            rating,
            image
        })
        await newSuggestion.save();
        res.status(200).json({message : "suggestion added successfully", suggestion: newSuggestion})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})
// affichage dial lusers
app.get('/showUsers' , async(req,res) => {
    try{
        const users = await User.find()
        if(!users) {
            res.status(400).json({message:"No users found"})
        }
        res.status(200).json(users)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})
app.put('/makeAdmin/:id', async (req, res) => {
    const userId = req.params.id
    try{
    const user = await User.findByIdAndUpdate(userId,{role:"admin"},{new:true})
    if(!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"User updated successfully", user})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }

}

)

app.put('/removeAdmin/:id', async (req, res) => {
    const userId = req.params.id
    try{
    const user = await User.findByIdAndUpdate(userId,{role:"user"},{new:true})
    if(!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"User updated successfully", user})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}
)
app.delete('/deleteUser/:id', async (req, res) => {
    const userId = req.params.id
    try{
    const user = await User.findByIdAndDelete(userId)
    if(!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"User deleted successfully", user})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}
)
app.get('/getPosts',async(req,res) => {
 try{
    const post = await posts.find().populate('user','username')
    res.status(200).json(post)
 }  
 catch(error){
    res.status(500).json({message:error.message})
 } 
})
module.exports = app;