const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // t7yd spaces
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    require: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  upvoters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  downvoters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  rating: {
    type: Number,
    default: 0, // yabda b zero
  },
});

module.exports = mongoose.model('Suggestion', suggestionSchema);