// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import from ALL three controllers
const { 
  createGroup, 
  getGroupMessages, 
  getUserGroups, 
  getGroupDetails,
  editGroup,
  deleteGroup,
  generateInvite
} = require('../controllers/groupController');

const { 
  isGroupOwner, 
  isGroupAdminOrOwner,
  getGroupMembers,
  addMember,
  removeMember,
  updateMemberRole,
  leaveGroup,
  isGroupMemberOrOwner
} = require('../controllers/groupMemberController');

const {
  editGroupMessage,
  deleteGroupMessage,
  getGroupMessage,
  addGroupMessageReaction
} = require('../controllers/groupMessageController');

// All routes are protected
router.use(protect);

// Group management
router.route('/')
  .post(createGroup)
  .get(getUserGroups);

router.route('/:groupId')
  .get(getGroupDetails)
  .put(isGroupAdminOrOwner, editGroup)  // Admins can edit too
  .delete(isGroupOwner, deleteGroup);   // Only owner can delete

// Messages
router.route('/:groupId/messages')
  .get(getGroupMessages);

router.route('/:groupId/messages/:messageId')
  .get(getGroupMessage)
  .put(editGroupMessage)
  .delete(deleteGroupMessage);

router.route('/:groupId/messages/:messageId/reaction')
  .post(addGroupMessageReaction);

// Members
router.route('/:groupId/members')
  .get(getGroupMembers)
  .post(isGroupAdminOrOwner, addMember);  // Admins can add members

router.route('/:groupId/members/:memberId')
  .delete(isGroupMemberOrOwner, removeMember);

router.route('/:groupId/members/:memberId/role')
  .put(isGroupOwner, updateMemberRole);  // Only owner can change roles

router.route('/:groupId/leave')
  .post(leaveGroup);

// Invites
router.route('/:groupId/invite')
  .post(isGroupAdminOrOwner, generateInvite);  // Admins can generate invites

module.exports = router;
