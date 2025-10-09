const db = require('../db');

// Search users for tagging
const searchUsers = async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({ message: 'Query must be at least 2 characters long' });
  }

  try {
    const [users] = await db.query(
      `SELECT id, name, username, email 
       FROM users 
       WHERE name LIKE ? OR username LIKE ? OR email LIKE ?
       AND id != ?
       LIMIT 10`,
      [`%${query}%`, `%${query}%`, `%${query}%`, req.user.id]
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Get group members for tagging
const getGroupMembersForTagging = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user is member of group
    const [membership] = await db.query(
      'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (membership.length === 0) {
      return res.status(403).json({ 
        success: false,
        message: 'Not a member of this group' 
      });
    }

    const [members] = await db.query(
      `SELECT u.id, u.name, u.username, u.email
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = ? AND u.id != ?`,
      [groupId, userId]
    );

    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error fetching group members for tagging:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Get user's recent conversations for tagging
const getRecentConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get recent private conversations
    const [privateChats] = await db.query(
      `SELECT u.id, u.name, u.username, MAX(m.timestamp) as last_message
       FROM messages m
       JOIN users u ON (m.sender_id = u.id OR m.receiver_id = u.id)
       WHERE (m.sender_id = ? OR m.receiver_id = ?) 
       AND u.id != ?
       GROUP BY u.id
       ORDER BY last_message DESC
       LIMIT 10`,
      [userId, userId, userId]
    );

    // Get recent groups
    const [groups] = await db.query(
      `SELECT g.id, g.name, g.description, MAX(gm.timestamp) as last_message
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       LEFT JOIN group_messages msg ON g.id = msg.group_id
       WHERE gm.user_id = ?
       GROUP BY g.id
       ORDER BY last_message DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        privateChats,
        groups
      }
    });
  } catch (error) {
    console.error('Error fetching recent conversations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = {
  searchUsers,
  getGroupMembersForTagging,
  getRecentConversations
};