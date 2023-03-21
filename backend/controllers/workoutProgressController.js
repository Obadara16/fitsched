const Progress = require('../models/progressModel');
const mongoose = require('mongoose');
const multer = require('multer');

// Set up multer for image uploads
const upload = multer({
  limits: {
    fileSize: 1000000, // 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image in JPG, JPEG, or PNG format'));
    }

    cb(undefined, true);
  },
});

// Add progress entry
const addProgressEntry = async (req, res) => {
  const { weight, reps, sets, week, month } = req.body;
  const user_id = req.user._id;

  try {
    const progress = await Progress.create({
      weight,
      reps,
      sets,
      week,
      month,
      user_id,
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all progress entries for a user
const getAllProgressEntries = async (req, res) => {
  const user_id = req.user._id;

  try {
    const progress = await Progress.find({ user_id }).sort({ createdAt: -1 });

    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get weekly progress entries for a user
const getWeeklyProgressEntries = async (req, res) => {
  const user_id = req.user._id;

  try {
    const progress = await Progress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      {
        $group: {
          _id: { week: '$week', year: { $year: '$createdAt' } },
          weight: { $avg: '$weight' },
          reps: { $avg: '$reps' },
          sets: { $avg: '$sets' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.week': -1 } },
    ]);

    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get monthly progress entries for a user
const getMonthlyProgressEntries = async (req, res) => {
  const user_id = req.user._id;

  try {
    const progress = await Progress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      {
        $group: {
          _id: { month: '$month', year: { $year: '$createdAt' } },
          weight: { $avg: '$weight' },
          reps: { $avg: '$reps' },
          sets: { $avg: '$sets' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload progress photo
const uploadProgressPhoto = async (req, res) => {
    const user_id = req.user._id;
  
    try {
      await upload.single('photo')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
  
        if (!req.file) {
          return res.status(400).json({ error: 'Please upload an image file' });
        }
  
        const progress = await Progress.findOneAndUpdate(
          { user_id },
          { $set: { photo: req.file.buffer } },
          { new: true }
        );
  
        res.status(200).json(progress);
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {
   uploadProgressPhoto, addProgressEntry, getAllProgressEntries, getWeeklyProgressEntries, getMonthlyProgressEntries
}
  
