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
                CASE WHEN u.id = g.owner_id THEN 1 ELSE 0 END as is_owner,
                gm.joined_at,
                g.name as group_name,
                g.owner_id
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id
             JOIN \`groups\` g ON gm.group_id = g.id
             WHERE gm.group_id = ?
             ORDER BY 
                 is_owner DESC, 
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
    const { userIdToAdd } = req.body;

    // Validate input
    if (!userIdToAdd || isNaN(parseInt(userIdToAdd))) {
        return res.status(400).json({ 
            success: false,
            message: 'Valid userIdToAdd is required.' 
        });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

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

        // 3. Check group member limit (optional safety measure)
        const [memberCount] = await connection.query(
            'SELECT COUNT(*) as count FROM group_members WHERE group_id = ?',
            [groupId]
        );
        
        if (memberCount[0].count >= 100) { // Reasonable limit
            await connection.rollback();
            return res.status(400).json({ 
                success: false,
                message: 'Group member limit reached (max 100 members).' 
            });
        }

        // 4. Add member to group
        await connection.query(
            'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', 
            [groupId, userIdToAdd]
        );

        // 5. Get group info for response
        const [groupInfo] = await connection.query(
            'SELECT name FROM `groups` WHERE id = ?',
            [groupId]
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
                    is_owner: 0
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

        // 1. Get group info
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

        // 3. Prevent owner from being removed by others
        if (memberIdInt === groupOwnerId && userId !== groupOwnerId) {
            await connection.rollback();
            return res.status(403).json({ 
                success: false,
                message: "You cannot remove the group owner from the group." 
            });
        }

        // 4. Allow owner to delete the group instead of leaving (they should use delete group endpoint)
        if (memberIdInt === groupOwnerId && userId === groupOwnerId) {
            await connection.rollback();
            return res.status(400).json({ 
                success: false,
                message: "Group owner cannot leave the group. Please use the 'Delete Group' option instead." 
            });
        }

        // 5. Remove member from group
        const [result] = await connection.query(
            'DELETE FROM group_members WHERE group_id = ? AND user_id = ?', 
            [groupId, memberIdInt]
        );

        await connection.commit();

        if (result.affectedRows > 0) {
            const message = memberIdInt === userId 
                ? 'You have left the group successfully.' 
                : 'Member removed successfully.';

            res.json({ 
                success: true,
                message: message,
                data: {
                    removedMemberId: memberIdInt,
                    memberName: groupInfo[0].member_name,
                    groupName: groupInfo[0].group_name,
                    isSelf: memberIdInt === userId
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

// @desc    Check if user is group owner
// @route   GET /api/groups/:groupId/is-owner
const checkIsOwner = async (req, res) => {
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

        const isOwner = groups[0].owner_id === userId;

        res.json({
            success: true,
            data: {
                isOwner,
                groupId: parseInt(groupId),
                groupName: groups[0].name
            }
        });

    } catch (error) {
        console.error('Error checking group ownership:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while checking group ownership.' 
        });
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
    getGroupMembers,
    addMember,
    removeMember,
    checkIsOwner,
    isGroupMemberOrOwner
};