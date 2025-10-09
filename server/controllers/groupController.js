// controllers/groupController.js
const db = require('../db');

// @desc    Get all groups for the current user
// @route   GET /api/groups
const getUserGroups = async (req, res) => {
  const userId = req.user.id;

  try {
    const [groups] = await db.query(
      `SELECT g.*, 
              COUNT(gm.user_id) as memberCount,
              u.name as owner_name
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.owner_id = u.id
       WHERE gm.user_id = ?
       GROUP BY g.id
       ORDER BY g.created_at DESC`,
      [userId]
    );

    // Add type field to identify as group in frontend
    const groupsWithType = groups.map(group => ({
      ...group,
      type: 'group'
    }));

    res.json(groupsWithType);

  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ message: "Server error while fetching groups." });
  }
};

// @desc    Create a new group
// @route   POST /api/groups
const createGroup = async (req, res) => {
  const { name, description, memberIds } = req.body;
  const ownerId = req.user.id;

  if (!name || !memberIds || !Array.isArray(memberIds)) {
    return res.status(400).json({ message: 'Group name and an array of memberIds are required.' });
  }

  // Validate memberIds are numbers
  if (memberIds.some(id => isNaN(parseInt(id)))) {
    return res.status(400).json({ message: 'All member IDs must be valid numbers.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Create the group
    const [groupResult] = await connection.query(
      'INSERT INTO `groups` (name, description, owner_id) VALUES (?, ?, ?)',
      [name, description || null, ownerId]
    );
    const groupId = groupResult.insertId;

    // 2. Add members to the group_members table
    // Ensure the owner is always a member
    const allMemberIds = [...new Set([ownerId, ...memberIds.map(id => parseInt(id))])];

    const memberValues = allMemberIds.map(userId => [groupId, userId]);
    await connection.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ?',
      [memberValues]
    );
    
    await connection.commit();

    // Fetch the created group details with member count
    const [groups] = await connection.query(
      `SELECT g.*, 
              COUNT(gm.user_id) as memberCount,
              u.name as owner_name
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.owner_id = u.id
       WHERE g.id = ?
       GROUP BY g.id`,
      [groupId]
    );

    const newGroup = {
      ...groups[0],
      type: 'group'
    };

    res.status(201).json(newGroup);

  } catch (error) {
    await connection.rollback();
    console.error("Error creating group:", error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: "One or more user IDs are invalid." });
    }
    
    res.status(500).json({ message: "Server error during group creation." });
  } finally {
    connection.release();
  }
};

// @desc    Get message history for a specific group
// @route   GET /api/groups/:groupId/messages
const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        // Authorization: Check if the user is a member of the group
        const [members] = await db.query(
          'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
          [groupId, userId]
        );
        
        if (members.length === 0) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this group." });
        }

        // Fetch messages along with sender's information
        const [messages] = await db.query(
            `SELECT gm.*, u.name as sender_name, u.username as sender_username 
             FROM group_messages gm
             JOIN users u ON gm.sender_id = u.id
             WHERE gm.group_id = ? 
             ORDER BY gm.timestamp ASC`,
            [groupId]
        );

        res.json(messages);

    } catch (error) {
        console.error("Error fetching group messages:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all members of a group
// @route   GET /api/groups/:groupId/members
const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        // Authorization: Check if the user is a member of the group
        const [membership] = await db.query(
          'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
          [groupId, userId]
        );
        
        if (membership.length === 0) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this group." });
        }

        // Fetch all group members with their details
        const [members] = await db.query(
            `SELECT u.id, u.name, u.username, u.email, 
                    CASE WHEN g.owner_id = u.id THEN 1 ELSE 0 END as is_owner,
                    gm.joined_at
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id
             JOIN \`groups\` g ON gm.group_id = g.id
             WHERE gm.group_id = ?
             ORDER BY g.owner_id = u.id DESC, u.name ASC`,
            [groupId]
        );

        res.json({ members, total: members.length });

    } catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Edit group information
// @route   PUT /api/groups/:groupId
const editGroup = async (req, res) => {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name && !description) {
        return res.status(400).json({ message: "Either name or description must be provided." });
    }

    try {
        // Check if group exists and user is owner
        const [groups] = await db.query(
            'SELECT * FROM `groups` WHERE id = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (groups.length === 0) {
            return res.status(404).json({ message: "Group not found or you are not the owner." });
        }

        // Build update query dynamically based on provided fields
        let updateFields = [];
        let updateValues = [];

        if (name) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (description) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }

        updateValues.push(groupId);

        const [result] = await db.query(
            `UPDATE \`groups\` SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Group not found or no changes made." });
        }

        // Fetch updated group
        const [updatedGroups] = await db.query(
            `SELECT g.*, 
                    COUNT(gm.user_id) as memberCount,
                    u.name as owner_name
             FROM \`groups\` g
             JOIN group_members gm ON g.id = gm.group_id
             JOIN users u ON g.owner_id = u.id
             WHERE g.id = ?
             GROUP BY g.id`,
            [groupId]
        );

        const updatedGroup = {
            ...updatedGroups[0],
            type: 'group'
        };

        res.json({ 
            message: "Group updated successfully.", 
            group: updatedGroup 
        });

    } catch (error) {
        console.error("Error editing group:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:groupId
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        // Check if group exists and user is owner
        const [groups] = await db.query(
            'SELECT * FROM `groups` WHERE id = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (groups.length === 0) {
            return res.status(404).json({ message: "Group not found or you are not the owner." });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Delete group messages
            await connection.query('DELETE FROM group_messages WHERE group_id = ?', [groupId]);
            
            // Delete group members
            await connection.query('DELETE FROM group_members WHERE group_id = ?', [groupId]);
            
            // Delete the group
            await connection.query('DELETE FROM `groups` WHERE id = ?', [groupId]);

            await connection.commit();

            res.json({ message: "Group deleted successfully." });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    createGroup, 
    getGroupMessages, 
    getUserGroups,
    editGroup,
    deleteGroup
    
};