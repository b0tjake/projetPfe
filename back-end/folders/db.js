const mongoose = require("mongoose")

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    }
    catch (err) {
        console.log("error in connecting to mongo db",err)
        process.exit(1)
    }
}
module.exports = db