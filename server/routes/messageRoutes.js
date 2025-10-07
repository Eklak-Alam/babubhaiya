// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
    getConversations,
    getChatHistory,
    clearConversation,
    editMessage,
    deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected and start with /api/messages
router.use(protect);

router.route('/conversations').get(getConversations);
router.route('/:messageId')
    .put(editMessage)
    .delete(deleteMessage);

router.route('/conversation/:otherUserId').delete(clearConversation);
router.route('/:otherUserId').get(getChatHistory);


module.exports = router;