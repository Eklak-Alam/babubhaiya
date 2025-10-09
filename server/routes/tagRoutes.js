const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchUsers,
  getGroupMembersForTagging,
  getRecentConversations
} = require('../controllers/tagController');

// Search users for tagging
router.get('/search-users', protect, searchUsers);

// Get group members for tagging
router.get('/group/:groupId/members', protect, getGroupMembersForTagging);

// Get recent conversations for quick tagging
router.get('/recent-conversations', protect, getRecentConversations);

module.exports = router;