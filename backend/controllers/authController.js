const mongoose = require('mongoose')
const User = require("../models/authModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const Verification = require("../models/verificationModel")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: "3d"})
}

const loginUser = async(req, res) => {
    const {email, password} = req.body

    try {

        if(!email || !password) {
            throw Error("All fields are required")
        }
    
        if(!validator.isEmail(email)) {
            throw Error("Email is not valid")
        }
        

        const user = await User.findOne({email})

        if (!user) {
            throw Error("Incorrect Email")
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            throw Error("Incorrect Password")
        }


        const token = createToken(user._id)


        res.status(200).json({user, token})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const registerUser = async(req, res) => {
    const {email, password} = req.body

    try {

        if(!email || !password) {
            throw Error("All fields are required")
        }
    
        if(!validator.isEmail(email)) {
            throw Error("Email is not valid")
        }
    
        if(!validator.isStrongPassword(password)) {
            throw Error("Password not strong Enough")
        }


        const exists = await User.findOne({email})
        if (exists) {
            throw Error("User already exists")
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newUser = await User.create({email, password: hash})

        const token = createToken(newUser._id)

        // Generate a unique verification code/token
        const verificationCode = uuidv4();

        // Save the verification code/token and the email address in a verification collection/table
        await Verification.create({ email, code: verificationCode });

        // Send a verification email to the user's email address with a link containing the verification code/token
        const verificationLink = `${process.env.BASE_URL}/verify/${verificationCode}`;
        await sendVerificationEmail(email, verificationLink);

        res.status(200).json({
          message: "A verification email has been sent to your email address",
        });

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      // Check if required fields are present
      if (!oldPassword || !newPassword) {
        throw Error("All fields are required");
      }
  
      // Check if new password is strong enough
      if (!validator.isStrongPassword(newPassword)) {
        throw Error("Password not strong enough");
      }
  
      // Get user ID from token in Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw Error("Authorization header not present");
      }
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decodedToken._id;
  
      // Find user by ID
      const user = await User.findById(userId);
  
      // Check if user exists
      if (!user) {
        throw Error("User does not exist");
      }
  
      // Check if old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw Error("Old password is incorrect");
      }
  
      // Hash new password and update user
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      user.password = hash;
      await user.save();
  
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Helper function to get the user ID and verify token from the authorization header
    const getUserIdFromToken = (authHeader) => {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        return decodedToken._id;
    };

  const updateUser = async (req, res) => {
    const { lastName, firstName, gender, age, weight } = req.body;
  
    try {
      // Get the user ID from the authorization header
      const userId = getUserIdFromToken(req.headers.authorization);
      console.log(userId)
  
      // Find user by ID
      const user = await User.findById(userId);
  
      // Check if user exists
      if (!user) {
        throw Error("User does not exist");
      }
  
      // Update user information
      if (lastName) user.lastName = lastName;
      if (firstName) user.firstName = firstName;
      if (gender) user.gender = gender;
      if (age) user.age = age;
      if (weight) user.weight = weight;
  
      await user.save();
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  
  

module.exports = {loginUser, registerUser, changePassword, updateUser}

