// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../db');

// Search users for tagging
router.get('/search-users', protect, async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({ message: 'Query must be at least 2 characters long' });
  }

  try {
    const [users] = await db.query(
      `SELECT id, name, username 
       FROM users 
       WHERE name LIKE ? OR username LIKE ? 
       LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group members for tagging
router.get('/group/:groupId/members-tagging', protect, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user is member of group
    const [membership] = await db.query(
      'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (membership.length === 0) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const [members] = await db.query(
      `SELECT u.id, u.name, u.username 
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = ?`,
      [groupId]
    );

    res.json(members);
  } catch (error) {
    console.error('Error fetching group members for tagging:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;