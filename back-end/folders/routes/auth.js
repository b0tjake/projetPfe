const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../user'); // Ensure the path is correct

const app = express();
app.use(express.json());

// Registration route
app.post('/register', async (req, res) => {
    const { username, fullname, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json("Email already in use");
        }

        // Create and save user
        const user = new User({ username, fullname, email, password });
        await user.save();
        res.status(201).json(user); // Return created user
    } catch (error) {
        console.log("Couldn't create user", error);
        res.status(400).json("Couldn't create user");
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(401).json("This email is not registered");
        }

        if (userExists.password !== password) {
            return res.status(401).json("Password is incorrect");
        }

        // Generate JWT token
        const token = jwt.sign({ email: userExists.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.log("Error during login", error);
        res.status(500).json("Error logging in");
    }
});


module.exports = app;