const mongoose = require('mongoose');

const scheduledWorkoutSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  reminderDate: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const ScheduledWorkout = mongoose.model('ScheduledWorkout', scheduledWorkoutSchema);

module.exports = ScheduledWorkout;
