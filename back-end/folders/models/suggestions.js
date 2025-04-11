const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim : true, // bax t7yd hadok spaces li kikono zaydin ex: "   hello     " -> "hello"
    },
    description : {
        type: String,
        required: true,
        trim : true,
    },
    image : {
        type: String,
        // required: true,
    },
    cost : {
        type: Number,
        required: true,
    },
    rating : [{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            unique : true, 
        },
        value:{
            type: Number,
            max : 5,
            min : 1
        }
    }],

})
module.exports = mongoose.model('Suggestion', suggestionSchema);