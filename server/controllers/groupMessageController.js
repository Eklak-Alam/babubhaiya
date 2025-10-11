// controllers/groupMessageController.js
const db = require('../db');

// @desc    Edit a group message
// @route   PUT /api/groups/:groupId/messages/:messageId
// @access  Private (Only message sender can edit)
const editGroupMessage = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const messageId = parseInt(req.params.messageId, 10);
        const { message_content } = req.body;
        const userId = req.user.id;

        console.log('Group edit request:', { groupId, messageId, message_content, userId });

        if (isNaN(groupId) || isNaN(messageId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid group or message ID.' 
            });
        }

        if (!message_content || message_content.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Message content is required.' 
            });
        }

        // Find the message and verify the sender in one query
        const [messages] = await db.query(
            'SELECT sender_id FROM group_messages WHERE id = ? AND group_id = ?',
            [messageId, groupId]
        );

        if (messages.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Message not found in this group.' 
            });
        }

        // Check if the user is the sender of the message
        if (messages[0].sender_id !== userId) {
            return res.status(403).json({ 
                success: false,
                message: 'You can only edit your own messages.' 
            });
        }

        // NO TIME LIMIT - Update the message
        await db.query(
            'UPDATE group_messages SET message_content = ?, edited_at = NOW() WHERE id = ?',
            [message_content.trim(), messageId]
        );

        // Fetch the updated message to send back
        const [updatedMessages] = await db.query(
            `SELECT gm.*, u.name as sender_name, u.username as sender_username 
             FROM group_messages gm 
             JOIN users u ON gm.sender_id = u.id 
             WHERE gm.id = ?`,
            [messageId]
        );

        res.json({
            success: true,
            message: 'Message updated successfully',
            data: updatedMessages[0]
        });

    } catch (error) {
        console.error('Error editing group message:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while editing message' 
        });
    }
};


// @desc    Delete a group message
// @route   DELETE /api/groups/:groupId/messages/:messageId
const deleteGroupMessage = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const messageId = parseInt(req.params.messageId, 10);
        const userId = req.user.id;

        if (isNaN(groupId) || isNaN(messageId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid group or message ID.' 
            });
        }

        // Fetch group owner and message sender details
        const [messages] = await db.query(
            `SELECT gm.sender_id, g.owner_id
             FROM group_messages gm 
             JOIN \`groups\` g ON gm.group_id = g.id
             WHERE gm.id = ? AND gm.group_id = ?`,
            [messageId, groupId]
        );

        if (messages.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Message not found in this group.' 
            });
        }

        const { sender_id, owner_id } = messages[0];

        // Check if user is the sender OR the group owner/admin
        if (sender_id !== userId && owner_id !== userId) {
            // Check if user is admin
            const [userRole] = await db.query(
                'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, userId]
            );
            
            if (userRole.length === 0 || userRole[0].role !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'You do not have permission to delete this message.' 
                });
            }
        }

        // Delete the message
        await db.query('DELETE FROM group_messages WHERE id = ?', [messageId]);

        res.json({
            success: true,
            message: 'Message deleted successfully',
            data: { messageId, groupId }
        });

    } catch (error) {
        console.error('Error deleting group message:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting message.' 
        });
    }
};



// @desc    Get a specific group message
// @route   GET /api/groups/:groupId/messages/:messageId
// @access  Private (Group members only)
const getGroupMessage = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const messageId = parseInt(req.params.messageId, 10);
        const userId = req.user.id;

        if (isNaN(groupId) || isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid group or message ID.'
            });
        }

        // Check if user is member of the group
        const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group'
            });
        }

        // Fetch the message with sender details
        const [messages] = await db.query(
            `SELECT gm.*, u.name as sender_name, u.username as sender_username 
             FROM group_messages gm 
             JOIN users u ON gm.sender_id = u.id 
             WHERE gm.id = ? AND gm.group_id = ?`,
            [messageId, groupId]
        );

        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: messages[0]
        });

    } catch (error) {
        console.error('Error fetching group message:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching message'
        });
    }
};

// @desc    Add reaction to group message
// @route   POST /api/groups/:groupId/messages/:messageId/reaction
const addGroupMessageReaction = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const messageId = parseInt(req.params.messageId, 10);
        const { reaction } = req.body;
        const userId = req.user.id;

        if (isNaN(groupId) || isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid group or message ID.'
            });
        }

        if (!reaction?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Reaction is required.'
            });
        }

        // Check if user is member of the group
        const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group'
            });
        }

        // Check if message exists
        const [message] = await db.query(
            'SELECT id FROM group_messages WHERE id = ? AND group_id = ?',
            [messageId, groupId]
        );

        if (message.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Add or update reaction
        await db.query(
            `INSERT INTO group_message_reactions (message_id, user_id, reaction) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), created_at = NOW()`,
            [messageId, userId, reaction.trim()]
        );

        // Get updated reactions with user info
        const [reactions] = await db.query(
            `SELECT gmr.*, u.name as user_name, u.username
             FROM group_message_reactions gmr
             JOIN users u ON gmr.user_id = u.id
             WHERE gmr.message_id = ? 
             ORDER BY gmr.created_at ASC`,
            [messageId]
        );

        res.json({
            success: true,
            message: 'Reaction added successfully',
            data: reactions
        });

    } catch (error) {
        console.error('Error adding group message reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding reaction'
        });
    }
};

module.exports = {
    editGroupMessage,
    deleteGroupMessage,
    getGroupMessage,
    addGroupMessageReaction
};