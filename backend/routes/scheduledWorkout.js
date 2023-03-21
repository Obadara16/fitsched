const express = require('express');
const router = express.Router();
const {scheduleWorkout, getAllScheduledWorkouts, getSingleScheduledWorkout, deleteScheduledWorkout, getWorkoutsWithRemindersDueToday} = require('../controllers/scheduledWorkoutController');
const requireAuth = require('../middlewares/requireAuth');

// Routes for scheduled workouts
router.post('/:id', requireAuth, scheduleWorkout);
router.get('/', requireAuth, getAllScheduledWorkouts);
router.get('/:id', requireAuth, getSingleScheduledWorkout);
router.delete('/:id', requireAuth, deleteScheduledWorkout);
router.get('/reminders/today', requireAuth, getWorkoutsWithRemindersDueToday);

module.exports = router;
