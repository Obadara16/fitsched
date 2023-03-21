const mongoose = require("mongoose")
const Schema = mongoose.Schema

const authSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true     
    },
    password: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('User', authSchema)