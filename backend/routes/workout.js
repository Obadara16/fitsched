const express = require("express")
const {createNewWorkout, getSingleWorkout, getAllWorkouts, deleteWorkout, updateWorkout} = require('../controllers/workoutController')
const requireAuth = require("../middlewares/requireAuth")

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

//Get all workouts
router.get('/', getAllWorkouts)

//Get a single workout
router.get('/:id', getSingleWorkout)

//Post a new workout
router.post('/', createNewWorkout)

//Delete a  workout
router.delete('/:id', deleteWorkout)

//Update a workout
router.patch('/:id', updateWorkout)


module.exports = router