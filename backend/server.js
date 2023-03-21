const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const workoutRoutes = require("./routes/workout")
const scheduleWorkoutRoutes = require("./routes/scheduledWorkout")
const workoutProgressRoutes = require("./routes/workoutProgress")
const authRoutes = require("./routes/auth")

//Use express
const app = express();


// Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path)
    next()
})

// Strict
mongoose.set('strictQuery', true);


// Connect Database
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server Running and Database Connected")
    })
})
.catch((err) => {
    console.log(err)
})

// Routes
app.use("/api/workouts", workoutRoutes)
app.use("/api/schedule", scheduleWorkoutRoutes)
app.use("/api/progress", workoutProgressRoutes)
app.use("/api/auth", authRoutes)