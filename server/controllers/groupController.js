// controllers/groupController.js
const db = require('../db');
const { generateInviteCode } = require('../utils/helpers');

// @desc    Get all groups for the current user with enhanced info
// @route   GET /api/groups
const getUserGroups = async (req, res) => {
  const userId = req.user.id;

  try {
    const [groups] = await db.query(
      `SELECT 
        g.*, 
        COUNT(gm.user_id) as member_count,
        u.name as owner_name,
        u.username as owner_username,
        (SELECT message_content 
         FROM group_messages 
         WHERE group_id = g.id 
         ORDER BY timestamp DESC 
         LIMIT 1) as last_message,
        (SELECT timestamp 
         FROM group_messages 
         WHERE group_id = g.id 
         ORDER BY timestamp DESC 
         LIMIT 1) as last_activity,
        gm.role as user_role,
        (SELECT COUNT(*) 
         FROM group_messages 
         WHERE group_id = g.id AND id > COALESCE(
           (SELECT last_read_message_id 
            FROM group_members 
            WHERE group_id = g.id AND user_id = ?), 0
         )) as unread_count
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.owner_id = u.id
       WHERE gm.user_id = ?
       GROUP BY g.id
       ORDER BY last_activity DESC, g.created_at DESC`,
      [userId, userId]
    );

    const groupsWithType = groups.map(group => ({
      ...group,
      type: 'group',
      member_count: parseInt(group.member_count),
      unread_count: parseInt(group.unread_count || 0)
    }));

    res.json({
      success: true,
      data: groupsWithType,
      total: groups.length
    });

  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching groups." 
    });
  }
};

// @desc    Create a new group with enhanced features
// @route   POST /api/groups
const createGroup = async (req, res) => {
  const { name, description, memberIds, is_public = false, avatar_url } = req.body;
  const ownerId = req.user.id;

  if (!name || !memberIds || !Array.isArray(memberIds)) {
    return res.status(400).json({ 
      success: false,
      message: 'Group name and an array of memberIds are required.' 
    });
  }

  // Validate memberIds
  const validMemberIds = memberIds.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));
  if (validMemberIds.length !== memberIds.length) {
    return res.status(400).json({ 
      success: false,
      message: 'All member IDs must be valid numbers.' 
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Create the group with enhanced fields
    const inviteCode = generateInviteCode();
    const [groupResult] = await connection.query(
      'INSERT INTO `groups` (name, description, owner_id, is_public, avatar_url, invite_link) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), description?.trim() || null, ownerId, is_public, avatar_url || null, inviteCode]
    );
    const groupId = groupResult.insertId;

    // 2. Add members to the group_members table with roles
    const allMemberIds = [...new Set([ownerId, ...validMemberIds])];
    const memberValues = allMemberIds.map(userId => [
      groupId, 
      userId, 
      userId === ownerId ? 'owner' : 'member',
      ownerId
    ]);

    await connection.query(
      'INSERT INTO group_members (group_id, user_id, role, added_by) VALUES ?',
      [memberValues]
    );

    // 3. Create initial "group created" system message (FIXED - removed is_system_message)
    const [user] = await connection.query('SELECT name FROM users WHERE id = ?', [ownerId]);
    const systemMessage = `${user[0].name} created the group "${name}"`;
    
    // FIX: Remove the is_system_message column reference
    await connection.query(
      'INSERT INTO group_messages (group_id, sender_id, message_content) VALUES (?, ?, ?)',
      [groupId, ownerId, systemMessage]
    );

    await connection.commit();

    // Fetch the created group with complete details
    const [groups] = await db.query(
      `SELECT 
        g.*, 
        COUNT(gm.user_id) as member_count,
        u.name as owner_name,
        u.username as owner_username,
        gm.role as user_role
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.owner_id = u.id
       WHERE g.id = ? AND gm.user_id = ?
       GROUP BY g.id`,
      [groupId, ownerId]
    );

    if (groups.length === 0) {
      throw new Error('Failed to fetch created group');
    }

    const newGroup = {
      ...groups[0],
      type: 'group',
      member_count: parseInt(groups[0].member_count)
    };

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: newGroup
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error creating group:", error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        success: false,
        message: "One or more user IDs are invalid." 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error during group creation." 
    });
  } finally {
    connection.release();
  }
};

// @desc    Get group messages with pagination and reactions
// @route   GET /api/groups/:groupId/messages
const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  const { limit = 50, offset = 0 } = req.query;

  try {
    // Authorization: Check if the user is a member of the group
    const [members] = await db.query(
      'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
      [groupId, userId]
    );
    
    if (members.length === 0) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden: You are not a member of this group." 
      });
    }

    // Update last read message
    await db.query(
      'UPDATE group_members SET last_read_message_id = (SELECT MAX(id) FROM group_messages WHERE group_id = ?) WHERE group_id = ? AND user_id = ?',
      [groupId, groupId, userId]
    );

    // Fetch messages with sender info and reactions
    const [messages] = await db.query(
      `SELECT 
        gm.*, 
        u.name as sender_name, 
        u.username as sender_username,
        u.avatar_url as sender_avatar,
        (SELECT COUNT(*) FROM group_message_reactions gmr WHERE gmr.message_id = gm.id) as reaction_count
       FROM group_messages gm
       JOIN users u ON gm.sender_id = u.id
       WHERE gm.group_id = ? 
       ORDER BY gm.timestamp DESC
       LIMIT ? OFFSET ?`,
      [groupId, parseInt(limit), parseInt(offset)]
    );

    // Get reactions for these messages
    const messageIds = messages.map(msg => msg.id);
    let reactions = [];
    
    if (messageIds.length > 0) {
      const [reactionData] = await db.query(
        `SELECT gmr.*, u.name as user_name, u.username
         FROM group_message_reactions gmr
         JOIN users u ON gmr.user_id = u.id
         WHERE gmr.message_id IN (?)
         ORDER BY gmr.created_at ASC`,
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
    const messagesWithReactions = messages.map(message => ({
      ...message,
      reactions: reactionsByMessage[message.id] || [],
      reaction_count: parseInt(message.reaction_count)
    }));

    res.json({
      success: true,
      data: messagesWithReactions.reverse(), // Reverse to get chronological order
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: messages.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// @desc    Get group details
// @route   GET /api/groups/:groupId
const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    // Check membership and get group details
    const [groups] = await db.query(
      `SELECT 
        g.*,
        u.name as owner_name,
        u.username as owner_username,
        gm.role as user_role,
        COUNT(gm2.user_id) as member_count,
        (SELECT COUNT(*) FROM group_messages WHERE group_id = g.id) as total_messages
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN group_members gm2 ON g.id = gm2.group_id
       JOIN users u ON g.owner_id = u.id
       WHERE g.id = ? AND gm.user_id = ?
       GROUP BY g.id`,
      [groupId, userId]
    );

    if (groups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found or you are not a member"
      });
    }

    const groupDetails = {
      ...groups[0],
      member_count: parseInt(groups[0].member_count),
      total_messages: parseInt(groups[0].total_messages)
    };

    res.json({
      success: true,
      data: groupDetails
    });

  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching group details"
    });
  }
};

// @desc    Update group information
// @route   PUT /api/groups/:groupId
const editGroup = async (req, res) => {
  const { groupId } = req.params;
  const { name, description, avatar_url, is_public } = req.body;
  const userId = req.user.id;

  if (!name && !description && !avatar_url && typeof is_public === 'undefined') {
    return res.status(400).json({ 
      success: false,
      message: "At least one field must be provided for update." 
    });
  }

  try {
    // Check if group exists and user is owner/admin
    const [groups] = await db.query(
      `SELECT g.*, gm.role 
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE g.id = ? AND gm.user_id = ? AND gm.role IN ('owner', 'admin')`,
      [groupId, userId]
    );

    if (groups.length === 0) {
      return res.status(403).json({ 
        success: false,
        message: "Group not found or you don't have permission to edit this group." 
      });
    }

    // Build update query
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name.trim());
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description?.trim() || null);
    }
    if (avatar_url !== undefined) {
      updateFields.push('avatar_url = ?');
      updateValues.push(avatar_url || null);
    }
    if (typeof is_public === 'boolean') {
      updateFields.push('is_public = ?');
      updateValues.push(is_public);
    }

    updateValues.push(groupId);

    const [result] = await db.query(
      `UPDATE \`groups\` SET ${updateFields.join(', ')}, last_activity = NOW() WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Group not found or no changes made." 
      });
    }

    // Create system message for significant changes
    if (name && groups[0].name !== name) {
      await db.query(
        'INSERT INTO group_messages (group_id, sender_id, message_content) VALUES (?, ?, ?)',
        [groupId, userId, `Group name changed to "${name}"`]
      );
    }

    // Fetch updated group
    const [updatedGroups] = await db.query(
      `SELECT g.*, 
              COUNT(gm.user_id) as member_count,
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
      type: 'group',
      member_count: parseInt(updatedGroups[0].member_count)
    };

    res.json({
      success: true,
      message: "Group updated successfully.",
      data: updatedGroup
    });

  } catch (error) {
    console.error("Error editing group:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// @desc    Generate invite link for group
// @route   POST /api/groups/:groupId/invite
const generateInvite = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  const { max_uses = null, expires_in_hours = 24 } = req.body;

  try {
    // Check permissions
    const [membership] = await db.query(
      'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (membership.length === 0 || membership[0].role === 'member') {
      return res.status(403).json({
        success: false,
        message: "Only admins and owners can generate invite links"
      });
    }

    const inviteCode = generateInviteCode();
    const expiresAt = expires_in_hours ? 
      new Date(Date.now() + expires_in_hours * 60 * 60 * 1000) : null;

    await db.query(
      'INSERT INTO group_invites (group_id, invite_code, created_by, max_uses, expires_at) VALUES (?, ?, ?, ?, ?)',
      [groupId, inviteCode, userId, max_uses, expiresAt]
    );

    const inviteLink = `${process.env.FRONTEND_URL}/join/${inviteCode}`;

    res.json({
      success: true,
      data: {
        invite_code: inviteCode,
        invite_link: inviteLink,
        expires_at: expiresAt,
        max_uses: max_uses
      }
    });

  } catch (error) {
    console.error("Error generating invite:", error);
    res.status(500).json({
      success: false,
      message: "Server error while generating invite"
    });
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
  getGroupDetails,
  editGroup,
  deleteGroup,
  generateInvite
};