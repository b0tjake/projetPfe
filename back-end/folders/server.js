const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const connectDb = require('./db');
const auth = require('./routes/auth');

dotenv.config()

connectDb()
app.use(express.json())
app.use(cors())
app.use("/api/auth", auth)

app.listen(5000,() => {
    console.log("Server is running on port 5000")
})
