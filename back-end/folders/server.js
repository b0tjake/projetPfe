/// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db');
const auth = require('./routes/auth');
const suggestionRoutes = require('../folders/routes/suggestionsRoute');  // Import the suggestion routes
const post = require('./routes/routepost')
const showUsers = require('./admin/admin')
const profile = require('./routes/profile')
const path = require('path');

dotenv.config();

connectDb(); 
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", auth);
app.use("/api/posts", post);
app.use('/api/suggestions', suggestionRoutes);  // Mount the suggestion routes
app.use('/api/admin/', showUsers)
app.use('/profilePics',express.static(path.join(__dirname, 'profilePics')));
app.use('/postImages', express.static(path.join(__dirname, 'postImages')));
app.use('/placesImages', express.static(path.join(__dirname, 'placesImages')));
app.use('/api/profile',profile )

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
