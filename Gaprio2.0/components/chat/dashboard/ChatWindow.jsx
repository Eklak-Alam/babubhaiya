// app/(main)/components/ChatWindow.jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IoSend, IoEllipsisVertical, IoSearch, IoAdd, IoClose, IoSave, IoCloseCircle } from 'react-icons/io5';
import { 
  FaUsers, FaInfoCircle, FaUserFriends, FaUserPlus, FaUserMinus, 
  FaCrown, FaEdit, FaTrash, FaPhone, FaVideo, FaCheck, FaRobot,
  FaReply, FaRegCopy, FaRegSmile
} from 'react-icons/fa';
import { useAuth } from '@/context/ApiContext';

const STYLES = {
  bg: {
    main: `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`,
    section: `bg-gray-800/60 backdrop-blur-xl`,
    card: `bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50`,
  },
  text: {
    primary: `text-white font-medium`,
    secondary: `text-gray-300`,
    muted: `text-gray-400`,
    accent: `text-blue-400 font-semibold`,
  },
  border: {
    light: `border border-gray-700/30`,
    medium: `border border-gray-600/50`,
    strong: `border border-gray-500/70`,
  },
  button: {
    primary: `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 border border-blue-500/30`,
    secondary: `bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300 border border-gray-600/50`,
    danger: `bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 border border-red-500/30`,
    success: `bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all duration-300 border border-green-500/30`,
  }
};

export default function ChatWindow({ selectedUser, messages, socket, onGroupUpdate, onGroupDelete, onMessageUpdate, onMessageDelete, onClearConversation }) {
  const { user, API } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [isSearching, setIsSearching] = useState(false);
  
  // Message actions state
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [messageMenu, setMessageMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showMessageActionsModal, setShowMessageActionsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const messageMenuRef = useRef(null);
  const editTextareaRef = useRef(null);

  const isGroup = selectedUser?.type === 'group';

  // SAFE MESSAGES - This fixes the error
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target)) {
        setMessageMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [safeMessages, replyingTo]);

  // Scroll to editing message when editing starts
  useEffect(() => {
    if (editingMessage && editTextareaRef.current) {
      const messageElement = editTextareaRef.current.closest('.message-container');
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [editingMessage]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Initialize when selectedUser changes
  useEffect(() => {
    inputRef.current?.focus();
    if (isGroup && selectedUser) {
      fetchGroupMembers();
      checkIfOwner();
      setEditForm({
        name: selectedUser.name,
        description: selectedUser.description || ''
      });
    } else {
      setGroupMembers([]);
      setIsOwner(false);
    }
    setReplyingTo(null);
    setEditingMessage(null);
    setMessageMenu(null);
    setShowMessageActionsModal(false);
    setTimeout(scrollToBottom, 100);
  }, [selectedUser, isGroup]);

  const fetchGroupMembers = useCallback(async () => {
    if (!isGroup || !selectedUser?.id) return;
    
    try {
      const response = await API.get(`/groups/${selectedUser.id}/members`);
      console.log('Group members response:', response.data);
      
      if (response.data?.success) {
        const members = response.data.data?.members || response.data.members || [];
        setGroupMembers(Array.isArray(members) ? members : []);
      } else {
        const members = response.data?.members || response.data || [];
        setGroupMembers(Array.isArray(members) ? members : []);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      setGroupMembers([]);
    }
  }, [isGroup, selectedUser, API]);

  const checkIfOwner = useCallback(async () => {
    if (!isGroup || !selectedUser?.id) return;
    
    try {
      if (selectedUser.owner_id) {
        setIsOwner(selectedUser.owner_id === user.id);
        return;
      }
      
      const response = await API.get(`/groups/${selectedUser.id}/is-owner`);
      if (response.data?.success) {
        setIsOwner(response.data.data.isOwner);
      }
    } catch (error) {
      console.error('Error checking ownership:', error);
      setIsOwner(false);
    }
  }, [isGroup, selectedUser, user, API]);

  // Clear Conversation Function
  const handleClearConversation = useCallback(async () => {
    if (!selectedUser) return;

    if (!window.confirm(
      `Are you sure you want to clear your conversation with ${selectedUser.name}? This action cannot be undone.`
    )) {
      return;
    }

    try {
      const response = await API.delete(`/messages/conversation/${selectedUser.id}`);

      if (response.data?.success) {
        if (onClearConversation) {
          onClearConversation(selectedUser.id);
        }
        
        // Clear local messages using safeMessages
        if (onMessageDelete) {
          safeMessages.forEach(msg => {
            onMessageDelete(msg.id);
          });
        }
        
        setMessageMenu(null);
        alert('✅ Conversation cleared successfully!');
      } else {
        alert(response.data?.message || "Failed to clear conversation.");
      }
    } catch (error) {
      console.error("❌ Error clearing conversation:", error);
      alert(
        error.response?.data?.message ||
          "Failed to clear conversation. Please try again."
      );
    }
  }, [selectedUser, safeMessages, API, onClearConversation, onMessageDelete]);

  // Message Actions
  const handleEditMessage = useCallback((message) => {
    setEditingMessage(message.id);
    setEditMessageContent(message.message_content);
    setShowMessageActionsModal(false);
    setSelectedMessage(null);
    
    // Focus and scroll to textarea after a small delay
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
        const messageElement = editTextareaRef.current.closest('.message-container');
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
  }, []);

  const handleSaveEdit = async () => {
    if (!editMessageContent.trim()) return;

    try {
      const response = await API.put(`/messages/${editingMessage}`, {
        message_content: editMessageContent.trim()
      });

      if (response.data?.success) {
        if (onMessageUpdate) {
          onMessageUpdate(editingMessage, editMessageContent.trim());
        }
        setEditingMessage(null);
        setEditMessageContent('');
      } else {
        alert(response.data?.message || 'Failed to update message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      alert(error.response?.data?.message || 'Failed to update message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await API.delete(`/messages/${messageId}`);

      if (response.data?.success) {
        if (onMessageDelete) {
          onMessageDelete(messageId);
        }
        setShowMessageActionsModal(false);
        setSelectedMessage(null);
      } else {
        alert(response.data?.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setShowMessageActionsModal(false);
    setSelectedMessage(null);
  };

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
    setShowMessageActionsModal(false);
    setSelectedMessage(null);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Open message actions modal
  const openMessageActions = (message) => {
    setSelectedMessage(message);
    setShowMessageActionsModal(true);
  };

  const searchUsersForGroup = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchUsers([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await API.get(`/users/search?q=${query}`);
      const usersData = response.data || [];
      const currentMembers = Array.isArray(groupMembers) ? groupMembers : [];
      const filteredUsers = usersData.filter(
        userResult => !currentMembers.some(member => member.id === userResult.id)
      );
      setSearchUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchUsers([]);
    } finally {
      setIsSearching(false);
    }
  }, [groupMembers, API]);

  const addMemberToGroup = async (userToAdd) => {
    try {
      const response = await API.post(`/groups/${selectedUser.id}/members`, {
        userIdToAdd: userToAdd.id
      });

      if (response.data?.success) {
        setGroupMembers(prev => {
          const currentMembers = Array.isArray(prev) ? prev : [];
          return [...currentMembers, { ...userToAdd, is_owner: 0 }];
        });
        
        setSearchUsers(prev => prev.filter(u => u.id !== userToAdd.id));
        setShowAddMemberModal(false);
        setSearchQuery('');
        
        alert(`✅ ${userToAdd.name} has been added to the group!`);
      } else {
        alert(response.data?.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) return;
    
    try {
      const response = await API.delete(`/groups/${selectedUser.id}/members/${memberId}`);
      
      if (response.data?.success) {
        setGroupMembers(prev => {
          const currentMembers = Array.isArray(prev) ? prev : [];
          return currentMembers.filter(member => member.id !== memberId);
        });
        
        alert(`✅ ${memberName} has been removed from the group!`);
      } else {
        alert(response.data?.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const editGroup = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Group name is required');
      return;
    }

    try {
      const response = await API.put(`/groups/${selectedUser.id}`, {
        name: editForm.name,
        description: editForm.description
      });
      
      if (response.data?.success) {
        if (onGroupUpdate && response.data?.group) {
          onGroupUpdate(response.data.group);
        } else if (onGroupUpdate) {
          onGroupUpdate({
            id: selectedUser.id,
            name: editForm.name,
            description: editForm.description,
            ...response.data
          });
        }
        
        setShowEditGroupModal(false);
        alert('✅ Group updated successfully!');
      } else {
        alert(response.data?.message || 'Failed to update group');
      }
    } catch (error) {
      console.error('Error editing group:', error);
      alert(error.response?.data?.message || 'Failed to update group');
    }
  };

  const deleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone and all messages will be lost.')) return;
    
    try {
      const response = await API.delete(`/groups/${selectedUser.id}`);
      
      if (response.data?.success) {
        if (onGroupDelete) {
          onGroupDelete(selectedUser.id);
        }
        
        setShowGroupInfo(false);
        alert('✅ Group deleted successfully!');
      } else {
        alert(response.data?.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert(error.response?.data?.message || 'Failed to delete group');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const messageData = {
        messageContent: newMessage.trim(),
        replyTo: replyingTo?.id || null
      };

      if (isGroup) {
        socket.emit('groupMessage', {
          groupId: selectedUser.id,
          ...messageData
        });
      } else {
        socket.emit('privateMessage', {
          receiverId: selectedUser.id,
          ...messageData
        });
      }
      setNewMessage('');
      setReplyingTo(null);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const startVoiceCall = () => {
    alert('Voice call feature would be implemented here');
  };

  const startVideoCall = () => {
    alert('Video call feature would be implemented here');
  };

  const leaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    try {
      const response = await API.delete(`/groups/${selectedUser.id}/members/${user.id}`);
      
      if (response.data?.success) {
        if (onGroupDelete) {
          onGroupDelete(selectedUser.id);
        }
        
        setShowGroupInfo(false);
        alert('✅ You have left the group!');
      } else {
        alert(response.data?.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert(error.response?.data?.message || 'Failed to leave group');
    }
  };

  const safeGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];

  if (!selectedUser) {
    return (
      <div className={`flex flex-col items-center justify-center flex-grow ${STYLES.bg.main} relative overflow-hidden`}>
        <div className="text-center p-8 relative z-10">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-blue-500/30">
            <FaRobot className="text-4xl text-gray-400" />
          </div>
          <p className="text-xl font-semibold text-white mb-2">
            Welcome to Chat
          </p>
          <p className="text-gray-400">
            Select a user or group to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-grow ${STYLES.bg.main} relative overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${STYLES.bg.section} relative z-10`}>
        <div className="flex items-center">
          {isGroup ? (
            <>
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-3 shadow-lg ring-2 ring-blue-500/30`}>
                <FaUsers className="text-white text-lg" />
              </div>
              <div>
                <h2 className={`font-bold text-white text-lg`}>{selectedUser.name}</h2>
                <div className="flex items-center gap-2">
                  <p className={`text-sm text-gray-300`}>
                    {safeGroupMembers.length > 0 ? safeGroupMembers.length : 'Loading...'} members • 
                    {selectedUser.owner_name && ` Created by ${selectedUser.owner_name}`}
                  </p>
                  {isOwner && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full flex items-center gap-1 border border-yellow-500/30">
                      <FaCrown size={10} />
                      Owner
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-3 shadow-lg ring-2 ring-blue-500/30`}>
                <span className="font-semibold text-white text-lg">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className={`font-bold text-white text-lg`}>{selectedUser.name}</h2>
                <p className={`text-sm text-gray-300 flex items-center gap-2`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isGroup && (
            <>
              <button 
                onClick={startVoiceCall}
                className={`p-3 text-gray-300 hover:text-green-400 transition-all duration-200 rounded-xl hover:bg-gray-700/50 backdrop-blur-sm border border-gray-600/30`}
                title="Voice Call"
              >
                <FaPhone size={18} />
              </button>
              <button 
                onClick={startVideoCall}
                className={`p-3 text-gray-300 hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-gray-700/50 backdrop-blur-sm border border-gray-600/30`}
                title="Video Call"
              >
                <FaVideo size={18} />
              </button>
              
              {/* Clear Conversation Button for individual chats */}
              <button 
                onClick={handleClearConversation}
                className={`flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-all duration-200 rounded-xl hover:bg-red-500/20 backdrop-blur-sm border border-red-500/30`}
              >
                <FaTrash size={14} />
                <span className="text-sm font-medium">Clear Chat</span>
              </button>
            </>
          )}
          
          {/* Group Info Button - Only for groups */}
          {isGroup && (
            <button 
              onClick={() => setShowGroupInfo(true)}
              className={`flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-700/50 backdrop-blur-sm border border-gray-600/30`}
            >
              <FaInfoCircle size={16} />
              <span className="text-sm font-medium">Group Info</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Messages Area - USING safeMessages INSTEAD OF messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10"
      >
        {safeMessages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full text-gray-500`}>
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-blue-500/30">
              <FaUserFriends className="text-3xl text-gray-400/50" />
            </div>
            <p className={`text-lg font-medium text-white opacity-70`}>No messages yet</p>
            <p className={`text-sm text-gray-500 mt-1`}>Start the conversation by sending a message!</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {safeMessages.map((msg, index) => {
              const isOwnMessage = msg.sender_id === user.id;
              const showSenderInfo = isGroup && !isOwnMessage;
              const isConsecutive = index > 0 && 
                safeMessages[index - 1].sender_id === msg.sender_id &&
                new Date(msg.timestamp) - new Date(safeMessages[index - 1].timestamp) < 300000;
              
              const showDateSeparator = index === 0 || 
                new Date(msg.timestamp).toDateString() !== new Date(safeMessages[index - 1].timestamp).toDateString();

              return (
                <div key={msg.id || index} className="message-container">
                  {showDateSeparator && (
                    <div className="flex justify-center my-6">
                      <span className={`px-4 py-2 text-xs text-gray-400 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm`}>
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                    isConsecutive ? 'mt-1' : 'mt-3'
                  } group relative`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 backdrop-blur-sm relative ${
                      isOwnMessage 
                        ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md` 
                        : `bg-gray-800/50 text-white rounded-bl-md border border-gray-700/50`
                    } ${isConsecutive ? 'mt-1' : 'mt-2'}`}>
                      
                      {/* Reply Context */}
                      {msg.reply_to && (
                        <div className={`text-xs mb-2 p-2 rounded-lg border-l-2 ${
                          isOwnMessage ? 'border-blue-300 bg-blue-400/20' : 'border-gray-500 bg-gray-700/30'
                        }`}>
                          <div className="font-medium truncate">
                            Replying to {msg.reply_to_sender_name || 'a message'}
                          </div>
                          <div className="truncate text-gray-400">
                            {msg.reply_to_content}
                          </div>
                        </div>
                      )}
                      
                      {showSenderInfo && !isConsecutive && (
                        <div className={`text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1`}>
                          {msg.sender_name}
                          {msg.sender_id === selectedUser.owner_id && (
                            <FaCrown size={10} className="text-yellow-400" />
                          )}
                        </div>
                      )}
                      
                      {editingMessage === msg.id ? (
                        <div className="space-y-3">
                          <textarea
                            ref={editTextareaRef}
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            rows="3"
                            placeholder="Edit your message..."
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setEditingMessage(null);
                                setEditMessageContent('');
                              }
                            }}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingMessage(null)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-sm transition-all duration-200"
                            >
                              <IoCloseCircle size={14} />
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              disabled={!editMessageContent.trim()}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-all duration-200 disabled:cursor-not-allowed"
                            >
                              <IoSave size={14} />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="break-words leading-relaxed text-white/90">{msg.message_content}</div>
                          
                          <div className={`text-xs mt-2 flex items-center justify-between ${
                            isOwnMessage ? 'text-blue-100/70' : 'text-gray-400'
                          }`}>
                            <span>{formatTime(msg.timestamp)}</span>
                            <div className="flex items-center gap-2">
                              {msg.edited_at && (
                                <span className="text-gray-400 italic text-xs">(edited)</span>
                              )}
                              {isOwnMessage && (
                                <span className="text-xs opacity-70 flex items-center gap-1">
                                  <FaCheck size={10} />
                                  <FaCheck size={10} className="-ml-2" />
                                </span>
                              )}
                              {/* Message Actions Button - Always Visible */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openMessageActions(msg);
                                }}
                                className={`p-1 rounded-lg transition-all duration-200 ${
                                  isOwnMessage 
                                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                                    : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                                }`}
                              >
                                <IoEllipsisVertical size={12} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 pt-3 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <FaReply size={12} />
                <span>Replying to <strong>{replyingTo.sender_name}</strong></span>
              </div>
              <div className="text-sm text-gray-400 truncate">
                {replyingTo.message_content}
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <IoClose size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className={`p-4 border-t border-gray-700/50 ${STYLES.bg.section} relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${isGroup ? selectedUser.name : selectedUser.name}...`}
              className={`w-full p-4 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 pr-12`}
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors rounded-lg"
                title="Emoji"
              >
                <FaRegSmile size={16} />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
            className={`p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 disabled:shadow-none min-w-[60px] backdrop-blur-sm border border-blue-500/30 disabled:border-gray-600/50`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <IoSend size={20} />
            )}
          </button>
        </div>
      </form>

      {/* Message Actions Modal */}
      {showMessageActionsModal && selectedMessage && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-xl`}>
            <div className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Message Actions</h3>
                <button 
                  onClick={() => {
                    setShowMessageActionsModal(false);
                    setSelectedMessage(null);
                  }}
                  className="p-1 hover:bg-blue-600/30 rounded-xl transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {selectedMessage.sender_id === user.id && (
                <>
                  <button
                    onClick={() => handleEditMessage(selectedMessage)}
                    className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-blue-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FaEdit className="text-blue-400" size={14} />
                      </div>
                      <div>
                        <div className={`font-medium text-white`}>Edit Message</div>
                        <div className={`text-xs text-gray-400`}>Modify your message</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <FaTrash className="text-red-400" size={14} />
                      </div>
                      <div>
                        <div className="font-medium text-red-400">Delete Message</div>
                        <div className={`text-xs text-gray-400`}>Permanently delete</div>
                      </div>
                    </div>
                  </button>
                </>
              )}

              <button
                onClick={() => handleReplyToMessage(selectedMessage)}
                className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-green-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaReply className="text-green-400" size={14} />
                  </div>
                  <div>
                    <div className={`font-medium text-green-400`}>Reply</div>
                    <div className={`text-xs text-gray-400`}>Reply to this message</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCopyMessage(selectedMessage.message_content)}
                className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-600/20 rounded-lg">
                    <FaRegCopy className="text-gray-400" size={14} />
                  </div>
                  <div>
                    <div className={`font-medium text-white`}>Copy Text</div>
                    <div className={`text-xs text-gray-400`}>Copy message content</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-4 border-t border-gray-700/50">
              <button
                onClick={() => {
                  setShowMessageActionsModal(false);
                  setSelectedMessage(null);
                }}
                className={`w-full px-4 py-3 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Info Sidebar */}
      {showGroupInfo && isGroup && (
        <div className="absolute inset-0 bg-black/60 z-40 flex justify-end animate-in slide-in-from-right duration-300">
          <div className={`w-full md:w-96 bg-gray-800/95 shadow-2xl border-l border-gray-700/50 overflow-y-auto backdrop-blur-xl`}>
            {/* Header */}
            <div className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl">Group Information</h3>
                  <p className="text-blue-100 text-sm mt-1">Manage your group settings</p>
                </div>
                <button 
                  onClick={() => setShowGroupInfo(false)}
                  className="p-2 hover:bg-blue-600/30 rounded-xl transition-all duration-200"
                >
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            {/* Group Details */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-4 shadow-lg ring-2 ring-blue-500/30`}>
                  <FaUsers className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className={`font-bold text-white text-xl`}>{selectedUser.name}</h4>
                  <p className={`text-sm text-gray-300 mt-1`}>
                    {safeGroupMembers.length} members • 
                    {selectedUser.owner_name && ` Created by ${selectedUser.owner_name}`}
                  </p>
                  {selectedUser.description && (
                    <p className="text-sm text-gray-400 mt-2">{selectedUser.description}</p>
                  )}
                </div>
              </div>
              
              {selectedUser.created_at && (
                <div className={`text-sm text-gray-400`}>
                  📅 Created on {formatDate(selectedUser.created_at)}
                </div>
              )}
            </div>

            {/* Members Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-semibold text-white text-lg`}>Group Members</h4>
                {isOwner && (
                  <button 
                    onClick={() => setShowAddMemberModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg backdrop-blur-sm border border-blue-500/30`}
                  >
                    <IoAdd size={16} />
                    Add Member
                  </button>
                )}
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {safeGroupMembers.map((member) => (
                  <div key={member.id} className={`flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3 text-white font-semibold shadow-md ring-1 ring-blue-500/30">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-medium text-white flex items-center gap-2`}>
                          {member.name}
                          {member.id === selectedUser.owner_id && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                              <FaCrown size={10} />
                              Owner
                            </span>
                          )}
                        </div>
                        <div className={`text-xs text-gray-400 flex items-center gap-2`}>
                          @{member.username}
                          {member.id === user.id && (
                            <span className="text-green-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isOwner && member.id !== selectedUser.owner_id && (
                      <button 
                        onClick={() => removeMember(member.id, member.name)}
                        className="p-2 text-red-400 hover:text-red-300 transition-all duration-200 rounded-lg hover:bg-red-500/20 backdrop-blur-sm border border-red-500/30"
                        title="Remove member"
                      >
                        <FaUserMinus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Group Actions */}
            <div className={`p-6 border-t border-gray-700/50 bg-gray-750/30`}>
              <h4 className={`font-semibold text-white mb-4 text-lg`}>Group Management</h4>
              <div className="space-y-3">
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => setShowEditGroupModal(true)}
                      className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-600/20 rounded-lg">
                          <FaEdit className="text-gray-400" />
                        </div>
                        <div>
                          <div className={`font-medium text-white`}>Edit Group Info</div>
                          <div className={`text-xs text-gray-400`}>Change name and description</div>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={deleteGroup}
                      className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <FaTrash className="text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium text-red-400">Delete Group</div>
                          <div className={`text-xs text-gray-400`}>Permanently delete this group</div>
                        </div>
                      </div>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={leaveGroup}
                    className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <FaUserMinus className="text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium text-red-400">Leave Group</div>
                        <div className={`text-xs text-gray-400`}>Leave this group</div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-700/50 backdrop-blur-xl`}>
            <div className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Add Members</h3>
                <button 
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSearchQuery('');
                    setSearchUsers([]);
                  }}
                  className="p-1 hover:bg-blue-600/30 rounded-xl transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400/70" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsersForGroup(e.target.value);
                  }}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm`}
                />
              </div>

              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className={`text-center py-8 text-gray-500`}>
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Searching users...</p>
                  </div>
                ) : searchUsers.length === 0 ? (
                  <div className={`text-center py-8 text-gray-500`}>
                    <FaUserFriends className="mx-auto text-3xl mb-2 opacity-50" />
                    <p>No users found</p>
                    <p className="text-sm">Search for users to add to the group</p>
                  </div>
                ) : (
                  searchUsers.map((user) => (
                    <div 
                      key={user.id}
                      onClick={() => addMemberToGroup(user)}
                      className={`flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 border-b border-gray-700/50 last:border-b-0 backdrop-blur-sm`}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-3 text-white text-sm font-semibold ring-1 ring-blue-500/30">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-medium text-white`}>{user.name}</div>
                          <div className={`text-xs text-gray-400`}>@{user.username}</div>
                        </div>
                      </div>
                      <FaUserPlus className="text-green-400" size={14} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditGroupModal && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-xl`}>
            <div className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Edit Group</h3>
                <button 
                  onClick={() => setShowEditGroupModal(false)}
                  className="p-1 hover:bg-blue-600/30 rounded-xl transition-colors"
                > 
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={editGroup} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-300 mb-2`}>
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className={`w-full p-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm`}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-300 mb-2`}>
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="3"
                    className={`w-full p-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm resize-none`}
                    placeholder="Enter group description (optional)"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditGroupModal(false)}
                  className={`flex-1 px-4 py-3 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg backdrop-blur-sm border border-blue-500/30`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
}