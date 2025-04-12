const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Path to the image
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true,
  },
  // likes: [{
  //   type: String,
  //   ref: 'User', // Array of users who liked the post
  // }],
  // comments: [{
  //   user: { type: String, ref: 'User' },
  //   text: { type: String, required: true },
  // }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
