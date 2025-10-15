const db = require("../db");

// @desc    Get all conversation partners with last message and unread count
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  const loggedInUserId = req.user.id;

  try {
    const query = `
    SELECT 
        u.id, 
        u.name, 
        u.username,
        last_msg.message_content as last_message,
        last_msg.timestamp as last_message_time,
        COALESCE(unread.unread_count, 0) as unread_count,
        last_msg.sender_id = ? as is_own_message
    FROM users u
    JOIN (
        SELECT DISTINCT
            CASE
                WHEN sender_id = ? THEN receiver_id
                ELSE sender_id
            END as other_user_id
        FROM messages
        WHERE (sender_id = ? OR receiver_id = ?)
        AND is_deleted = false  -- ADD THIS LINE
    ) AS convos ON u.id = convos.other_user_id
    LEFT JOIN (
        SELECT 
            CASE 
                WHEN sender_id = ? THEN receiver_id
                ELSE sender_id
            END as other_user_id,
            message_content,
            timestamp,
            sender_id,
            id
        FROM messages m1
        WHERE timestamp = (
            SELECT MAX(timestamp)
            FROM messages m2
            WHERE ((m2.sender_id = m1.sender_id AND m2.receiver_id = m1.receiver_id)
            OR (m2.sender_id = m1.receiver_id AND m2.receiver_id = m1.sender_id))
            AND m2.is_deleted = false  -- ADD THIS LINE
        )
    ) AS last_msg ON u.id = last_msg.other_user_id
    LEFT JOIN (
        SELECT 
            sender_id,
            COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = ? AND is_read = false AND is_deleted = false  -- ADD THIS LINE
        GROUP BY sender_id
    ) AS unread ON u.id = unread.sender_id
    ORDER BY last_msg.timestamp DESC;
`;

    const [conversations] = await db.query(query, [
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
    ]);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get message history with another user - UPDATED: Include AI responses
// @route   GET /api/messages/:otherUserId
const getChatHistory = async (req, res) => {
  const loggedInUserId = req.user.id;
  const otherUserId = req.params.otherUserId;
  const { limit = 50, offset = 0 } = req.query;

  try {
    // First mark messages as read
    await db.query(
      `UPDATE messages 
             SET is_read = true 
             WHERE receiver_id = ? AND sender_id = ? AND is_read = false`,
      [loggedInUserId, otherUserId]
    );

    // UPDATED QUERY: Include AI responses in the conversation
    const [messages] = await db.query(
      `SELECT m.*, 
                    u.name as sender_name,
                    u.username as sender_username,
                    (SELECT COUNT(*) FROM message_reactions mr WHERE mr.message_id = m.id) as reaction_count
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE (m.sender_id = ? AND m.receiver_id = ?) 
             OR (m.sender_id = ? AND m.receiver_id = ?)
             OR (m.is_ai_response = true AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)))
             ORDER BY m.timestamp DESC
             LIMIT ? OFFSET ?`,
      [
        loggedInUserId,
        otherUserId,
        otherUserId,
        loggedInUserId,
        loggedInUserId,
        otherUserId,
        otherUserId,
        loggedInUserId,
        parseInt(limit),
        parseInt(offset),
      ]
    );

    // Get reactions for these messages
    const messageIds = messages.map((msg) => msg.id);
    let reactions = [];

    if (messageIds.length > 0) {
      const [reactionData] = await db.query(
        `SELECT mr.*, u.name as user_name
                 FROM message_reactions mr
                 JOIN users u ON mr.user_id = u.id
                 WHERE mr.message_id IN (?)
                 ORDER BY mr.created_at ASC`,
        [messageIds]
      );
      reactions = reactionData;
    }

    // Group reactions by message
    const reactionsByMessage = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.message_id]) {
        acc[reaction.message_id] = [];
      }
      acc[reaction.message_id].push(reaction);
      return acc;
    }, {});

    // Add reactions to messages
    const messagesWithReactions = messages.map((message) => ({
      ...message,
      reactions: reactionsByMessage[message.id] || [],
    }));

    res.json({
      success: true,
      data: messagesWithReactions.reverse(), // Reverse to get chronological order
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: messages.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// controllers/messageController.js

// @desc    Clear entire conversation with another user (HARD DELETE)
// @route   DELETE /api/messages/conversation/:otherUserId
const clearConversation = async (req, res) => {
  const loggedInUserId = req.user.id;
  const otherUserId = req.params.otherUserId;

  console.log(
    "🗑️ Clearing conversation between:",
    loggedInUserId,
    "and",
    otherUserId
  );

  try {
    // HARD DELETE all messages between these two users
    const [result] = await db.query(
      `DELETE FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?)`,
      [loggedInUserId, otherUserId, otherUserId, loggedInUserId]
    );

    console.log(
      `✅ Cleared conversation between user ${loggedInUserId} and user ${otherUserId}. Affected ${result.affectedRows} messages.`
    );

    res.json({
      success: true,
      message: "Conversation cleared successfully.",
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("❌ Error clearing conversation:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while clearing conversation.",
    });
  }
};

// @desc    Edit a message sent by the user
// @route   PUT /api/messages/:messageId
// @desc    Edit a message sent by the user
// @route   PUT /api/messages/:messageId
const editMessage = async (req, res) => {
  const loggedInUserId = req.user.id;
  const { messageId } = req.params;
  const { message_content } = req.body;

  console.log("🔍 EDIT MESSAGE DEBUG:", {
    messageId: messageId,
    message_content: message_content,
    userId: loggedInUserId,
    body: req.body,
    params: req.params,
  });

  if (!message_content?.trim()) {
    console.log("❌ Empty message content");
    return res.status(400).json({
      success: false,
      message: "Message content cannot be empty.",
    });
  }

  // Validate messageId is a number
  const messageIdNum = parseInt(messageId);
  if (isNaN(messageIdNum)) {
    console.log("❌ Invalid message ID:", messageId);
    return res.status(400).json({
      success: false,
      message: "Invalid message ID.",
    });
  }

  try {
    // 1. First, get the message to verify the sender
    const [messages] = await db.query(
      "SELECT sender_id, message_content FROM messages WHERE id = ?",
      [messageIdNum]
    );

    console.log("📋 Found messages:", messages);

    if (messages.length === 0) {
      console.log("❌ Message not found:", messageIdNum);
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const message = messages[0];

    // 2. SECURITY CHECK: Make sure the logged-in user is the sender
    if (message.sender_id !== loggedInUserId) {
      console.log("❌ Permission denied:", {
        messageSender: message.sender_id,
        currentUser: loggedInUserId,
      });
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only edit your own messages.",
      });
    }

    console.log("✅ Permission granted, updating message...");

    // 3. Update the message
    const [result] = await db.query(
      "UPDATE messages SET message_content = ?, edited_at = NOW() WHERE id = ?",
      [message_content.trim(), messageIdNum]
    );

    console.log("📝 Update result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or no changes made.",
      });
    }

    // 4. Get the updated message with sender info
    const [updatedMessages] = await db.query(
      `SELECT m.*, u.name as sender_name, u.username as sender_username
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.id = ?`,
      [messageIdNum]
    );

    console.log("✅ Message updated successfully:", updatedMessages[0]);

    res.json({
      success: true,
      message: "Message updated successfully.",
      data: updatedMessages[0],
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete a message sent by the user
// @route   DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
  const loggedInUserId = req.user.id;
  const { messageId } = req.params;

  try {
    // 1. First, get the message to verify the sender
    const [messages] = await db.query(
      "SELECT sender_id FROM messages WHERE id = ?",
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const message = messages[0];

    // 2. SECURITY CHECK: Make sure the logged-in user is the sender
    if (message.sender_id !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only delete your own messages.",
      });
    }

    // 3. HARD DELETE the message
    const [result] = await db.query("DELETE FROM messages WHERE id = ?", [
      messageId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Add reaction to a message
// @route   POST /api/messages/:messageId/reaction
const addReaction = async (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;
  const { reaction, isGroupMessage = false } = req.body;

  if (!reaction?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Reaction cannot be empty",
    });
  }

  try {
    const table = isGroupMessage
      ? "group_message_reactions"
      : "message_reactions";
    const messageTable = isGroupMessage ? "group_messages" : "messages";

    // Check if message exists and user has permission to see it
    let messageQuery = "";
    let queryParams = [messageId];

    if (isGroupMessage) {
      messageQuery = `
                SELECT gm.* 
                FROM ${messageTable} gm
                JOIN group_members gmemb ON gm.group_id = gmemb.group_id
                WHERE gm.id = ? AND gmemb.user_id = ?
            `;
      queryParams.push(userId);
    } else {
      messageQuery = `
                SELECT * FROM ${messageTable} 
                WHERE id = ? AND (sender_id = ? OR receiver_id = ?)
            `;
      queryParams.push(userId, userId);
    }

    const [message] = await db.query(messageQuery, queryParams);

    if (message.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or access denied",
      });
    }

    // Add or update reaction
    await db.query(
      `INSERT INTO ${table} (message_id, user_id, reaction) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), created_at = NOW()`,
      [messageId, userId, reaction.trim()]
    );

    // Get updated reactions with user info
    const [reactions] = await db.query(
      `SELECT mr.*, u.name as user_name, u.username
             FROM ${table} mr
             JOIN users u ON mr.user_id = u.id
             WHERE mr.message_id = ? 
             ORDER BY mr.created_at ASC`,
      [messageId]
    );

    res.json({
      success: true,
      data: reactions,
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Remove reaction from a message
// @route   DELETE /api/messages/:messageId/reaction
const removeReaction = async (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;
  const { isGroupMessage = false } = req.body;

  try {
    const table = isGroupMessage
      ? "group_message_reactions"
      : "message_reactions";

    const [result] = await db.query(
      `DELETE FROM ${table} WHERE message_id = ? AND user_id = ?`,
      [messageId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Reaction not found",
      });
    }

    res.json({
      success: true,
      message: "Reaction removed successfully",
    });
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Mark messages as read
// @route   POST /api/messages/mark-read
const markMessagesAsRead = async (req, res) => {
  const userId = req.user.id;
  const { messageIds, otherUserId } = req.body;

  try {
    let result;

    if (messageIds && messageIds.length > 0) {
      // Mark specific messages as read
      [result] = await db.query(
        `UPDATE messages 
                 SET is_read = true 
                 WHERE id IN (?) AND receiver_id = ?`,
        [messageIds, userId]
      );
    } else if (otherUserId) {
      // Mark all messages from a user as read
      [result] = await db.query(
        `UPDATE messages 
                 SET is_read = true 
                 WHERE sender_id = ? AND receiver_id = ? AND is_read = false`,
        [otherUserId, userId]
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Either messageIds or otherUserId must be provided",
      });
    }

    res.json({
      success: true,
      message: "Messages marked as read",
      readCount: result.affectedRows,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getConversations,
  getChatHistory,
  clearConversation,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  markMessagesAsRead,
};
