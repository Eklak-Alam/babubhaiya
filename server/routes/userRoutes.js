// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, searchUsers, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All these routes are protected
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/search', protect, searchUsers);
router.get('/stats', protect, getUserStats);

module.exports = router;