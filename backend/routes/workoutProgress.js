const express = require('express');
const router = express.Router();
const verifyAuth = require("../middlewares/requireAuth")
const {addProgressEntry, getAllProgressEntries, getWeeklyProgressEntries, getMonthlyProgressEntries, uploadProgressPhoto} = require("../controllers/workoutProgressController");
const requireAuth = require('../middlewares/requireAuth');

// Routes for progress entries
router.post('/', requireAuth, addProgressEntry);
router.get('/', requireAuth, getAllProgressEntries);
router.get('/weekly', requireAuth, getWeeklyProgressEntries);
router.get('/monthly', requireAuth, getMonthlyProgressEntries);

// Route for progress photo upload
router.post('/photo', requireAuth, uploadProgressPhoto);

module.exports = router;
