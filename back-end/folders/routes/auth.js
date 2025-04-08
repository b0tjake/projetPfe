const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure the path is correct
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination : (req,file,cb) => 
    cb(null,'profilePics/'),
    filename : (req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    }
    
    })
const upload = multer({storage})

const app = express();
app.use(express.json());

// Registration route
app.post('/register',upload.single('image'), async (req, res) => {
    const { username, fullname, email, password } = req.body;

    try {
        const userNameExiste = await User.findOne({ username });
        if (userNameExiste) {
            return res.status(400).json({message: "Username already exists"});
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }

        const user = new User({ username, fullname, email, password , image:req.file? req.file.path:undefined });
        await user.save();
        res.status(201).json({message: "User created successfully" , user : user});
    } catch (error) {
        console.log("Couldn't create user", error);
        res.status(400).json({message: "Couldn't create user"});
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
        const token = jwt.sign({ email: userExists.email,
            username : userExists.username,
            fullname : userExists.fullname,
            image:userExists.image }
        ,   process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({message:"You will be redirected to Home", token : token });
    } catch (error) {
        console.log("Error during login", error);
        res.status(500).json("Error logging in");
    }
});


module.exports = app;