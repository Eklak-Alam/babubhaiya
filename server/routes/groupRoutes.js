// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createGroup, 
    getGroupMessages, 
    getUserGroups, 
    editGroup,
    deleteGroup
} = require('../controllers/groupController');
const { 
    isGroupOwner, 
    addMember, 
    removeMember, 
    isGroupMemberOrOwner,
    getGroupMembers  // ✅ Import from groupMemberController
} = require('../controllers/groupMemberController');

// All routes are protected
router.use(protect);

// Routes for creating a group or getting all user groups
router.route('/')
    .post(createGroup)
    .get(getUserGroups);

// Routes for a specific group (edit, delete)
// Only the owner can perform these actions
router.route('/:groupId')
    .put(isGroupOwner, editGroup)
    .delete(isGroupOwner, deleteGroup);

// Group message routes
router.route('/:groupId/messages')
    .get(getGroupMessages);

// Group member routes
router.route('/:groupId/members')
    .get(getGroupMembers)  // ✅ Now using the correct function
    .post(isGroupOwner, addMember);

// Allow members to remove themselves, but only owners can remove others
router.route('/:groupId/members/:memberId')
    .delete(isGroupMemberOrOwner, removeMember);

module.exports = router;
