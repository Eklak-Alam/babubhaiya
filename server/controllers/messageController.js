const db = require('../db');

// @desc    Get all conversation partners for the logged-in user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
    const loggedInUserId = req.user.id;

    try {
        // This is a more complex query to get the latest message for each conversation
        const query = `
          SELECT u.id, u.name, u.username
          FROM users u
          JOIN (
              SELECT DISTINCT
                  CASE
                      WHEN sender_id = ? THEN receiver_id
                      ELSE sender_id
                  END as other_user_id
              FROM messages
              WHERE sender_id = ? OR receiver_id = ?
          ) AS convos ON u.id = convos.other_user_id;
        `;
        
        const [conversations] = await db.query(query, [loggedInUserId, loggedInUserId, loggedInUserId]);
        res.json(conversations);

    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get message history with another user
// @route   GET /api/messages/:otherUserId
const getChatHistory = async (req, res) => {
    const loggedInUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    try {
        const [messages] = await db.query(
            `SELECT * FROM messages 
               WHERE (sender_id = ? AND receiver_id = ?) 
               OR (sender_id = ? AND receiver_id = ?) 
               ORDER BY timestamp ASC`,
            [loggedInUserId, otherUserId, otherUserId, loggedInUserId]
        );
        res.json(messages);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Clear entire conversation with another user
// @route   DELETE /api/messages/conversation/:otherUserId
const clearConversation = async (req, res) => {
    const loggedInUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    try {
        // Delete all messages between the two users
        const [result] = await db.query(
            `DELETE FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?)`,
            [loggedInUserId, otherUserId, otherUserId, loggedInUserId]
        );

        console.log(`🗑️ Cleared conversation between user ${loggedInUserId} and user ${otherUserId}. Deleted ${result.affectedRows} messages.`);

        res.json({ 
            message: "Conversation cleared successfully.", 
            deletedCount: result.affectedRows 
        });

    } catch (error) {
        console.error("Error clearing conversation:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Edit a message sent by the user
// @route   PUT /api/messages/:messageId
const editMessage = async (req, res) => {
    const loggedInUserId = req.user.id;
    const { messageId } = req.params;
    const { message_content } = req.body;

    if (!message_content) {
        return res.status(400).json({ message: "Message content cannot be empty." });
    }

    try {
        // 1. First, get the message to verify the sender
        const [messages] = await db.query('SELECT sender_id FROM messages WHERE id = ?', [messageId]);

        if (messages.length === 0) {
            return res.status(404).json({ message: "Message not found." });
        }

        const message = messages[0];

        // 2. SECURITY CHECK: Make sure the logged-in user is the sender
        if (message.sender_id !== loggedInUserId) {
            return res.status(403).json({ message: "Forbidden: You can only edit your own messages." });
        }

        // 3. If the check passes, update the message
        const [result] = await db.query(
            'UPDATE messages SET message_content = ?, edited_at = NOW() WHERE id = ?',
            [message_content, messageId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Message not found or no changes made." });
        }
        
        res.json({ message: "Message updated successfully." });

    } catch (error) {
        console.error("Error editing message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a message sent by the user
// @route   DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
    const loggedInUserId = req.user.id;
    const { messageId } = req.params;

    try {
        // 1. First, get the message to verify the sender
        const [messages] = await db.query('SELECT sender_id FROM messages WHERE id = ?', [messageId]);

        if (messages.length === 0) {
            // It's okay if it's already deleted, so we don't return 404.
            return res.status(200).json({ message: "Message already deleted or never existed." });
        }

        const message = messages[0];

        // 2. SECURITY CHECK: Make sure the logged-in user is the sender
        if (message.sender_id !== loggedInUserId) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own messages." });
        }

        // 3. If the check passes, delete the message
        await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
        
        res.status(200).json({ message: "Message deleted successfully." });

    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    getConversations, 
    getChatHistory,
    clearConversation, // ✅ Add this export
    editMessage,
    deleteMessage
};