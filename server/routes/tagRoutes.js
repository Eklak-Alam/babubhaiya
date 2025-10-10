// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchUsers,
  getGroupMembersForTagging,
  getRecentConversations,
  getFrequentContacts
} = require('../controllers/tagController');

router.get('/search', protect, searchUsers);
router.get('/group/:groupId/members', protect, getGroupMembersForTagging);
router.get('/recent-conversations', protect, getRecentConversations);
router.get('/frequent-contacts', protect, getFrequentContacts);

module.exports = router;