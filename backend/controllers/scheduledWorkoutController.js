const mongoose = require('mongoose');
const ScheduledWorkout = require('../models/sheduledWorkoutModel');
const Workout = require("../models/workoutModel")

// Schedule a workout and set a reminder
const scheduleWorkout = async (req, res) => {
    const { id } = req.params;
    const { scheduledDate, scheduledTime } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such workout found' });
    }
  
    const workout = await Workout.findById(id);
  
    if (!workout) {
      return res.status(404).json({ error: 'No such workout found' });
    }

    // Check if scheduled time is either 'morning' or 'evening'
    if (scheduledTime !== 'morning' && scheduledTime !== 'evening') {
        return res.status(400).json({ error: 'Scheduled time must be either "morning" or "evening"' });
    }

    const existingSchedule = await ScheduledWorkout.findOne({ workoutId: id, scheduledTime: scheduledTime });

    if (existingSchedule) {
        return res.status(400).json({ error: 'Workout already scheduled' });
    }
  
    const reminderDate = new Date(scheduledDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // set reminder 1 day before the workout
  
    const scheduledWorkout = new ScheduledWorkout({
      user_id: req.user._id,
      workout_id: id,
      scheduledDate,
      scheduledTime,
      reminderDate,
    });
  
    const savedScheduledWorkout = await scheduledWorkout.save();
  
    res.status(200).json(savedScheduledWorkout);
  };
  

// Get all scheduled workouts
const getAllScheduledWorkouts = async (req, res) => {
  const user_id = req.user._id;

  const workouts = await ScheduledWorkout.find({ user_id, scheduledDate: { $ne: null } }).sort({ scheduledDate: 1 });

  res.status(200).json(workouts);
};

// Get a single scheduled workout
const getSingleScheduledWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  const workout = await ScheduledWorkout.findById(id);
  

  if (!workout || !workout.scheduledDate) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  res.status(200).json(workout);
};

// Delete a scheduled workout
const deleteScheduledWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  const workout = await ScheduledWorkout.findById(id);

  if (!workout || !workout.scheduledDate) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  workout.scheduledDate = null;
  workout.reminderDate = null;

  const updatedWorkout = await workout.save();

  res.status(200).json(updatedWorkout);
};

// Get all workouts with reminders due today
const getWorkoutsWithRemindersDueToday = async (req, res) => {
  const user_id = req.user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workouts = await ScheduledWorkout.find({ user_id, reminderDate: { $lt: today } }).sort({ reminderDate: 1 });

  res.status(200).json(workouts);
};

module.exports = {
  scheduleWorkout,
  getAllScheduledWorkouts,
  getSingleScheduledWorkout,
  deleteScheduledWorkout,
  getWorkoutsWithRemindersDueToday,
};
