// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getConversations, 
    getChatHistory, 
    clearConversation, // ✅ Import the new function
    editMessage, 
    deleteMessage 
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected and start with /api/messages
router.use(protect);

router.route('/conversations').get(getConversations);
router.route('/:otherUserId').get(getChatHistory);
router.route('/conversation/:otherUserId').delete(clearConversation); // ✅ Add this route

// New routes for editing and deleting a specific message
router.route('/:messageId')
    .put(editMessage)
    .delete(deleteMessage);

module.exports = router;