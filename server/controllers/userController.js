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

module.exports = { getUserProfile, updateUserProfile, searchUsers };