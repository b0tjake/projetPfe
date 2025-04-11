// routes/suggestion.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const suggestion = require('../models/suggestions');  // import your suggestion model

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
        const checkUser = await suggestion.findOne({ 'rating.userId': rating.userId });
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
app.post('/getSuggestion', async (req, res) => {
    try {
        const suggestions = await suggestion.find();
        if (suggestions.length === 0) {
            return res.status(404).json({ message: "No suggestions found" });
        }
        res.status(200).json(suggestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





module.exports = app;
