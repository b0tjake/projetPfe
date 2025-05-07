// routes/suggestion.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Suggestion = require('../models/suggestions');  // import your suggestion model

const app = express();

// Set storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'placesImages');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // save with unique name
    }
});
const upload = multer({ storage });

// Define POST route for creating a new suggestion
app.post("/addSuggestion", upload.single('image'), async (req, res) => {
    const { title, description, cost, rating } = req.body;
    const image = req.file ? req.file.path : null;  // Check if the file exists
    try {
        const checkUser = await Suggestion.findOne({ 'rating.userId': rating.userId });
        if (checkUser) {
            return res.status(400).json({ message: "You have already added a suggestion!" });
        }
        const newSuggestion = new suggestion({ title, description, cost, rating, image });

        await newSuggestion.save();
        res.status(200).json({ message: "Suggestion added successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//route bach njibo les suggestions
app.post('/getSuggestion', async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        if (suggestions.length === 0) {
            return res.status(404).json({ message: "No suggestions found" });
        }
        res.status(200).json(suggestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/upVote', async (req, res) => {
    const { placeId, userId } = req.body;

    try {
        const suggestion = await Suggestion.findById(placeId);

        if (!suggestion) {
            return res.status(404).json({ message: 'Place not found' });
        }


        if (suggestion.upvoters.includes(userId)) {
            return res.status(400).json({ message: 'You already upvoted this place' });
        }

        // Remove downvote if exists
        suggestion.downvoters = suggestion.downvoters.filter(
            (id) => id.toString() !== userId
        );

        // Add upvote
        suggestion.upvoters.push(userId);
        suggestion.rating += 1;

        await suggestion.save();

        res.status(200).json({
            message: 'Upvoted successfully',
            updatedPlace: suggestion
        });

    } catch (err) {
        console.error('Error upvoting:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/downVote',async(req,res) => {
    const {placeId,userId} = req.body
    try{
        const suggestion = await Suggestion.findById(placeId)
        if(!suggestion){
            return res.status(404).json({message: 'Place not found'})
        }

        if(suggestion.downvoters.includes(userId)){
            return res.status(400).json({message: 'You already downvoted this place'})
        }
        suggestion.upvoters = suggestion.upvoters.filter((id) => id.toString() !== userId)
        suggestion.downvoters.push(userId)
        suggestion.rating -= 1
        await suggestion.save()
        res.status(200).json({
            message: "downVote successfully", 
            updatedPlace: suggestion,
                })
    }
    catch(err){
        console.error('Error downvoting:', err)
        res.status(500).json({message: 'Server error'})
    }
})
app.delete('/:id' , async (req, res) => {
    const { id } = req.params;
    try {
        const suggestion = await Suggestion.findByIdAndDelete(id);
        res.status(200).json({ message: 'Suggestion deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = app;
