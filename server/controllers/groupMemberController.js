// controllers/groupMemberController.js
const db = require('../db');

// Middleware to check if the logged-in user is the owner of the group
const isGroupOwner = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    try {
        const [groups] = await db.query(
            'SELECT owner_id, name FROM `groups` WHERE id = ?', 
            [groupId]
        );
        
        if (groups.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Group not found.' 
            });
        }
        
        if (groups[0].owner_id !== userId) {
            return res.status(403).json({ 
                success: false,
                message: 'Forbidden: Only the group owner can perform this action.' 
            });
        }
        
        // Add group info to request for later use
        req.groupInfo = groups[0];
        next();
    } catch (error) {
        console.error('Error in isGroupOwner middleware:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while verifying group ownership.' 
        });
    }
};

// Middleware to check if user is admin or owner
const isGroupAdminOrOwner = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const [membership] = await db.query(
            'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group.'
            });
        }

        if (!['owner', 'admin'].includes(membership[0].role)) {
            return res.status(403).json({
                success: false,
                message: 'Only group admins or owners can perform this action.'
            });
        }

        next();
    } catch (error) {
        console.error('Error in isGroupAdminOrOwner middleware:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while verifying permissions.'
        });
    }
};

// @desc    Get all members of a group
// @route   GET /api/groups/:groupId/members
const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        // Check if user is member of the group
        const [membership] = await db.query(
            `SELECT gm.*, g.name as group_name 
             FROM group_members gm 
             JOIN \`groups\` g ON gm.group_id = g.id 
             WHERE gm.group_id = ? AND gm.user_id = ?`, 
            [groupId, userId]
        );
        
        if (membership.length === 0) {
            return res.status(403).json({ 
                success: false,
                message: "Forbidden: You are not a member of this group." 
            });
        }

        // Fetch all group members with detailed information
        const [members] = await db.query(
            `SELECT 
                u.id, 
                u.name, 
                u.username, 
                u.email,
                u.avatar_url,
                gm.role,
                CASE WHEN u.id = g.owner_id THEN 'owner' ELSE gm.role END as display_role,
                gm.joined_at,
                gm.added_by,
                adder.name as added_by_name,
                g.name as group_name,
                g.owner_id
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id
             JOIN \`groups\` g ON gm.group_id = g.id
             LEFT JOIN users adder ON gm.added_by = adder.id
             WHERE gm.group_id = ?
             ORDER BY 
                 CASE WHEN u.id = g.owner_id THEN 1 WHEN gm.role = 'admin' THEN 2 ELSE 3 END,
                 u.name ASC`,
            [groupId]
        );

        // Get total member count
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total_count FROM group_members WHERE group_id = ?',
            [groupId]
        );

        res.json({
            success: true,
            data: {
                members,
                totalCount: countResult[0].total_count,
                groupInfo: {
                    id: parseInt(groupId),
                    name: membership[0].group_name
                }
            }
        });

    } catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching group members." 
        });
    }
};

// @desc    Add a member to a group
// @route   POST /api/groups/:groupId/members
const addMember = async (req, res) => {
    const { groupId } = req.params;
    const { userIdToAdd, role = 'member' } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!userIdToAdd || isNaN(parseInt(userIdToAdd))) {
        return res.status(400).json({ 
            success: false,
            message: 'Valid userIdToAdd is required.' 
        });
    }

    // Validate role
    if (!['member', 'admin'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Role must be either "member" or "admin".'
        });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // Check if current user has permission to add members
        const [currentUserRole] = await connection.query(
            'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (currentUserRole.length === 0 || currentUserRole[0].role === 'member') {
            await connection.rollback();
            return res.status(403).json({
                success: false,
                message: 'Only admins and owners can add members to the group.'
            });
        }

        // 1. Check if user exists
        const [users] = await connection.query(
            'SELECT id, name, username FROM users WHERE id = ?', 
            [userIdToAdd]
        );
        
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                success: false,
                message: 'User not found.' 
            });
        }

        // 2. Check if user is already a member
        const [existingMembers] = await connection.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
            [groupId, userIdToAdd]
        );
        
        if (existingMembers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ 
                success: false,
                message: 'User is already a member of this group.' 
            });
        }

        // 3. Check group member limit
        const [memberCount] = await connection.query(
            'SELECT COUNT(*) as count FROM group_members WHERE group_id = ?',
            [groupId]
        );
        
        if (memberCount[0].count >= 100) {
            await connection.rollback();
            return res.status(400).json({ 
                success: false,
                message: 'Group member limit reached (max 100 members).' 
            });
        }

        // 4. Add member to group
        await connection.query(
            'INSERT INTO group_members (group_id, user_id, role, added_by) VALUES (?, ?, ?, ?)', 
            [groupId, userIdToAdd, role, userId]
        );

        // 5. Create system message
        const [currentUser] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
        const [newUser] = await connection.query('SELECT name FROM users WHERE id = ?', [userIdToAdd]);
        const [groupInfo] = await connection.query('SELECT name FROM `groups` WHERE id = ?', [groupId]);

        const systemMessage = `${currentUser[0].name} added ${newUser[0].name} to the group`;
        await connection.query(
            'INSERT INTO group_messages (group_id, sender_id, message_content, is_system_message) VALUES (?, ?, ?, ?)',
            [groupId, userId, systemMessage, true]
        );

        await connection.commit();

        res.status(201).json({ 
            success: true,
            message: 'Member added successfully.',
            data: {
                user: {
                    id: users[0].id,
                    name: users[0].name,
                    username: users[0].username,
                    role: role,
                    added_by: userId
                },
                group: {
                    id: parseInt(groupId),
                    name: groupInfo[0].name
                }
            }
        });

    } catch (error) {
        await connection.rollback();
        
        console.error("Error adding member:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                success: false,
                message: 'User is already a member of this group.' 
            });
        }
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ 
                success: false,
                message: 'User or group not found.' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server error while adding member.' 
        });
    } finally {
        connection.release();
    }
};

// @desc    Remove a member from a group
// @route   DELETE /api/groups/:groupId/members/:memberId
const removeMember = async (req, res) => {
    const { groupId, memberId } = req.params;
    const userId = req.user.id;

    // Validate memberId
    if (isNaN(parseInt(memberId))) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid member ID.' 
        });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Get group info and member details
        const [groupInfo] = await connection.query(
            `SELECT g.owner_id, g.name as group_name, 
                    u.name as member_name, u.id as member_id
             FROM \`groups\` g
             LEFT JOIN users u ON u.id = ?
             WHERE g.id = ?`,
            [memberId, groupId]
        );

        if (groupInfo.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                success: false,
                message: 'Group not found.' 
            });
        }

        const groupOwnerId = groupInfo[0].owner_id;
        const memberIdInt = parseInt(memberId);

        // 2. Check if the member exists in the group
        const [existingMember] = await connection.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
            [groupId, memberIdInt]
        );

        if (existingMember.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                success: false,
                message: 'Member not found in this group.' 
            });
        }

        // 3. Check permissions
        const [currentUserRole] = await connection.query(
            'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        const isSelf = memberIdInt === userId;
        const isOwner = userId === groupOwnerId;
        const isAdmin = currentUserRole.length > 0 && currentUserRole[0].role === 'admin';

        // Permission logic:
        // - Owners can remove anyone except themselves
        // - Admins can remove members but not other admins or owners
        // - Members can only remove themselves
        if (!isSelf) {
            if (!isOwner && !isAdmin) {
                await connection.rollback();
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to remove other members.'
                });
            }

            if (isAdmin) {
                const [targetMemberRole] = await connection.query(
                    'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
                    [groupId, memberIdInt]
                );
                
                if (targetMemberRole.length > 0 && 
                    (targetMemberRole[0].role === 'admin' || memberIdInt === groupOwnerId)) {
                    await connection.rollback();
                    return res.status(403).json({
                        success: false,
                        message: 'Admins cannot remove other admins or the group owner.'
                    });
                }
            }
        }

        // 4. Prevent owner from being removed
        if (memberIdInt === groupOwnerId) {
            await connection.rollback();
            return res.status(403).json({ 
                success: false,
                message: "Group owner cannot be removed from the group." 
            });
        }

        // 5. Remove member from group
        const [result] = await connection.query(
            'DELETE FROM group_members WHERE group_id = ? AND user_id = ?', 
            [groupId, memberIdInt]
        );

        // 6. Create system message if not self-removal
        if (!isSelf) {
            const [removerUser] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
            const systemMessage = `${removerUser[0].name} removed ${groupInfo[0].member_name} from the group`;
            await connection.query(
                'INSERT INTO group_messages (group_id, sender_id, message_content, is_system_message) VALUES (?, ?, ?, ?)',
                [groupId, userId, systemMessage, true]
            );
        }

        await connection.commit();

        if (result.affectedRows > 0) {
            const message = isSelf 
                ? 'You have left the group successfully.' 
                : 'Member removed successfully.';

            res.json({ 
                success: true,
                message: message,
                data: {
                    removedMemberId: memberIdInt,
                    memberName: groupInfo[0].member_name,
                    groupName: groupInfo[0].group_name,
                    isSelf: isSelf
                }
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Member not found in this group.' 
            });
        }

    } catch (error) {
        await connection.rollback();
        console.error("Error removing member:", error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while removing member.' 
        });
    } finally {
        connection.release();
    }
};

// @desc    Update member role
// @route   PUT /api/groups/:groupId/members/:memberId/role
const updateMemberRole = async (req, res) => {
    const { groupId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user.id;

    if (!role || !['member', 'admin'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Valid role (member or admin) is required.'
        });
    }

    if (isNaN(parseInt(memberId))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid member ID.'
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check if current user is owner
        const [groupInfo] = await connection.query(
            'SELECT owner_id FROM `groups` WHERE id = ?',
            [groupId]
        );

        if (groupInfo.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Group not found.'
            });
        }

        if (groupInfo[0].owner_id !== userId) {
            await connection.rollback();
            return res.status(403).json({
                success: false,
                message: 'Only group owner can change member roles.'
            });
        }

        const memberIdInt = parseInt(memberId);

        // Prevent changing owner's role
        if (memberIdInt === groupInfo[0].owner_id) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot change role of group owner.'
            });
        }

        // Update role
        const [result] = await connection.query(
            'UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ?',
            [role, groupId, memberIdInt]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Member not found in group.'
            });
        }

        // Create system message
        const [currentUser] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
        const [targetUser] = await connection.query('SELECT name FROM users WHERE id = ?', [memberIdInt]);
        const action = role === 'admin' ? 'promoted to admin' : 'demoted to member';
        
        const systemMessage = `${currentUser[0].name} ${action} ${targetUser[0].name}`;
        await connection.query(
            'INSERT INTO group_messages (group_id, sender_id, message_content, is_system_message) VALUES (?, ?, ?, ?)',
            [groupId, userId, systemMessage, true]
        );

        await connection.commit();

        res.json({
            success: true,
            message: `Member role updated to ${role} successfully.`,
            data: {
                memberId: memberIdInt,
                memberName: targetUser[0].name,
                newRole: role
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating member role:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating member role.'
        });
    } finally {
        connection.release();
    }
};

// @desc    Leave group
// @route   POST /api/groups/:groupId/leave
const leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check if user is group owner
        const [groupInfo] = await connection.query(
            'SELECT owner_id, name FROM `groups` WHERE id = ?',
            [groupId]
        );

        if (groupInfo.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Group not found.'
            });
        }

        if (groupInfo[0].owner_id === userId) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: "Group owner cannot leave the group. Transfer ownership or delete the group instead."
            });
        }

        // Remove user from group
        const [result] = await connection.query(
            'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'You are not a member of this group.'
            });
        }

        // Create system message
        const [user] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
        const systemMessage = `${user[0].name} left the group`;
        await connection.query(
            'INSERT INTO group_messages (group_id, sender_id, message_content, is_system_message) VALUES (?, ?, ?, ?)',
            [groupId, userId, systemMessage, true]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'You have left the group successfully.',
            data: {
                groupId: parseInt(groupId),
                groupName: groupInfo[0].name
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error leaving group:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while leaving group.'
        });
    } finally {
        connection.release();
    }
};

// Middleware to check if user is either the group owner OR the member trying to remove themselves
const isGroupMemberOrOwner = async (req, res, next) => {
    const { groupId, memberId } = req.params;
    const userId = req.user.id;

    try {
        // Check if group exists
        const [groups] = await db.query('SELECT owner_id FROM `groups` WHERE id = ?', [groupId]);
        if (groups.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Group not found.' 
            });
        }

        const groupOwnerId = groups[0].owner_id;
        const memberIdInt = parseInt(memberId);

        // If user is the owner, allow any removal (except themselves, handled in removeMember)
        if (groupOwnerId === userId) {
            return next();
        }

        // If user is not the owner, only allow them to remove themselves
        if (memberIdInt !== userId) {
            return res.status(403).json({ 
                success: false,
                message: 'Forbidden: You can only remove yourself from the group. Only the owner can remove other members.' 
            });
        }

        // Check if the user is actually a member of the group
        const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', 
            [groupId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({ 
                success: false,
                message: 'Forbidden: You are not a member of this group.' 
            });
        }

        next();
    } catch (error) {
        console.error("Error in isGroupMemberOrOwner:", error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

module.exports = {
    isGroupOwner,
    isGroupAdminOrOwner,
    getGroupMembers,
    addMember,
    removeMember,
    updateMemberRole,
    leaveGroup,
    isGroupMemberOrOwner
};