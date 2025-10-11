// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
    getConversations,
    getChatHistory,
    clearConversation,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    markMessagesAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected and start with /api/messages
router.use(protect);

router.route('/conversations').get(getConversations);
router.route('/mark-read').post(markMessagesAsRead);

// Make sure this route is correctly defined
router.route('/:messageId')
    .put(editMessage)    // This should handle PUT /api/messages/296
    .delete(deleteMessage);

router.route('/:messageId/reaction')
    .post(addReaction)
    .delete(removeReaction);

router.route('/conversation/:otherUserId')
    .delete(clearConversation);
    
router.route('/:otherUserId').get(getChatHistory);

module.exports = router;