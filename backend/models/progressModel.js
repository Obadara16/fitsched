const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String
  }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
