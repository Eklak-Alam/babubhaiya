// controllers/groupMessageController.js
const db = require('../db');

// @desc    Edit a group message
// @route   PUT /api/groups/:groupId/messages/:messageId
// @access  Private (Only message sender can edit)
const editGroupMessage = async (req, res) => {
    try {
        const { groupId, messageId } = req.params;
        const { message_content } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!message_content || message_content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        // Check if group exists
        const [groups] = await db.query(
            'SELECT id, name, owner_id FROM `groups` WHERE id = ?',
            [groupId]
        );

        if (groups.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
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

        // Find the message
        const [messages] = await db.query(
            `SELECT gm.*, u.name as sender_name 
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

        const message = messages[0];

        // Check if user is the sender of the message
        if (message.sender_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own messages'
            });
        }

        // Update the message
        const [result] = await db.query(
            'UPDATE group_messages SET message_content = ?, edited_at = NOW() WHERE id = ? AND group_id = ?',
            [message_content.trim(), messageId, groupId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or no changes made'
            });
        }

        // Fetch the updated message
        const [updatedMessages] = await db.query(
            `SELECT gm.*, u.name as sender_name, u.username as sender_username 
             FROM group_messages gm 
             JOIN users u ON gm.sender_id = u.id 
             WHERE gm.id = ? AND gm.group_id = ?`,
            [messageId, groupId]
        );

        const updatedMessage = updatedMessages[0];

        res.json({
            success: true,
            message: 'Message updated successfully',
            data: updatedMessage
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
// @access  Private (Only message sender or group owner can delete)
const deleteGroupMessage = async (req, res) => {
    try {
        const { groupId, messageId } = req.params;
        const userId = req.user.id;

        // Check if group exists
        const [groups] = await db.query(
            'SELECT id, name, owner_id FROM `groups` WHERE id = ?',
            [groupId]
        );

        if (groups.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        const group = groups[0];

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

        // Find the message
        const [messages] = await db.query(
            `SELECT gm.*, u.name as sender_name 
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

        const message = messages[0];

        // Check if user is the sender of the message OR group owner
        const isOwner = group.owner_id === userId;
        const isSender = message.sender_id === userId;

        if (!isSender && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own messages'
            });
        }

        // Delete the message
        const [result] = await db.query(
            'DELETE FROM group_messages WHERE id = ? AND group_id = ?',
            [messageId, groupId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully',
            data: {
                messageId: parseInt(messageId),
                groupId: parseInt(groupId),
                deletedBy: userId
            }
        });

    } catch (error) {
        console.error('Error deleting group message:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting message'
        });
    }
};

// @desc    Get a specific group message
// @route   GET /api/groups/:groupId/messages/:messageId
// @access  Private (Group members only)
const getGroupMessage = async (req, res) => {
    try {
        const { groupId, messageId } = req.params;
        const userId = req.user.id;

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

module.exports = {
    editGroupMessage,
    deleteGroupMessage,
    getGroupMessage
};