// controllers/userController.js
const db = require('../db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the authMiddleware
    const [users] = await db.query('SELECT id, name, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    const { name, username } = req.body;
    try {
        await db.query(
            'UPDATE users SET name = ?, username = ? WHERE id = ?',
            [name, username, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        // Handle potential duplicate username error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Search for users by username
// @route   GET /api/users/search?q=...
const searchUsers = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }
    try {
        const [users] = await db.query(
            "SELECT id, name, username FROM users WHERE username LIKE ? AND id != ?", 
            [`%${query}%`, req.user.id] // Exclude the current user from search results
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get user statistics
// @route   GET /api/users/stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get message count
    const [messageCount] = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE sender_id = ?',
      [userId]
    );
    
    // Get groups joined count
    const [groupsCount] = await db.query(
      'SELECT COUNT(*) as count FROM group_members WHERE user_id = ?',
      [userId]
    );
    
    // Get AI chats count (you might need to adjust this based on your AI chat tracking)
    const [aiChatsCount] = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND is_ai = true',
      [userId]
    );
    
    // Calculate active days (days since account creation with activity)
    const [activeDays] = await db.query(
      `SELECT COUNT(DISTINCT DATE(created_at)) as count 
       FROM messages 
       WHERE sender_id = ? 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId]
    );

    res.json({
      totalMessages: messageCount[0].count,
      groupsJoined: groupsCount[0].count,
      aiChats: aiChatsCount[0].count,
      activeDays: activeDays[0].count
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { getUserProfile, updateUserProfile, searchUsers, getUserStats };