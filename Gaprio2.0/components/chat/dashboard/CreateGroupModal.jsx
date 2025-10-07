// app/(main)/components/CreateGroupModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaSearch, FaUserPlus, FaUsers, FaCheck, 
  FaUserFriends, FaCrown, FaPlus, FaTrash, FaExclamationTriangle
} from 'react-icons/fa';
import { IoClose, IoSend, IoPeople } from 'react-icons/io5';
import { useAuth } from '@/context/ApiContext';

export default function CreateGroupModal({ onClose, onGroupCreated }) {
  const { user, API } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Focus search input when tab changes
  useEffect(() => {
    if (activeTab === 'members' && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 300);
    }
  }, [activeTab]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await API.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
      const filteredResults = response.data.filter(
        userResult => !selectedMembers.some(member => member.id === userResult.id) && userResult.id !== user.id
      );
      setSearchResults(filteredResults);
      setError('');
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const addMember = (userToAdd) => {
    if (selectedMembers.length >= 49) {
      setError('Maximum 50 members allowed per group (including you)');
      return;
    }
    setSelectedMembers(prev => [...prev, userToAdd]);
    setSearchResults(prev => prev.filter(result => result.id !== userToAdd.id));
    setSearchQuery('');
    setError('');
  };
  
  const removeMember = (userToRemove) => {
    setSelectedMembers(prev => prev.filter(member => member.id !== userToRemove.id));
    setError('');
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required.');
      return;
    }
    if (groupName.length > 100) {
      setError('Group name must be less than 100 characters');
      return;
    }
    if (groupDescription.length > 500) {
      setError('Description must be less than 500 characters');
      return;
    }
    if (selectedMembers.length === 0) {
      setError('You must add at least one member.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const memberIds = selectedMembers.map(m => m.id);
      const response = await API.post('/groups', { 
        name: groupName.trim(), 
        description: groupDescription.trim(),
        memberIds 
      });
      
      onGroupCreated(response.data);
      onClose();
    } catch(err) {
      console.error('Create group error:', err);
      setError(err.response?.data?.message || 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (str) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ];
    const index = str ? str.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl dark:bg-gray-800 max-h-[95vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
              >
                <IoPeople className="text-2xl" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold"
                >
                  Create New Group
                </motion.h2>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100 text-sm"
                >
                  Connect with friends and colleagues
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-blue-100 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/20 backdrop-blur-sm"
            >
              <IoClose size={24} />
            </motion.button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'details'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-white dark:bg-gray-800 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaUsers className="flex-shrink-0" />
              Group Details
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'members'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-white dark:bg-gray-800 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaUserFriends className="flex-shrink-0" />
              Add Members ({selectedMembers.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Panel - Group Details */}
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-6 overflow-y-auto"
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-center mb-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <IoPeople className="text-white text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Group Information
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Set up your group name and description
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Group Name *
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          placeholder="Enter group name..."
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                          maxLength={100}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            This will be the display name for your group
                          </span>
                          <span className="text-xs text-gray-400">
                            {groupName.length}/100
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Description
                        </label>
                        <motion.textarea
                          whileFocus={{ scale: 1.02 }}
                          placeholder="What's this group about? (Optional)"
                          value={groupDescription}
                          onChange={(e) => setGroupDescription(e.target.value)}
                          rows={4}
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 shadow-sm"
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Briefly describe the purpose of this group
                          </span>
                          <span className="text-xs text-gray-400">
                            {groupDescription.length}/500
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Preview */}
                    {groupName && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-2 border-blue-200 dark:border-blue-800"
                      >
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          Group Preview
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <IoPeople className="text-white text-lg" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-white">
                              {groupName}
                            </div>
                            {groupDescription && (
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {groupDescription}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {selectedMembers.length + 1} members • You as owner
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Panel - Add Members */}
            <AnimatePresence mode="wait">
              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-6 overflow-y-auto border-l dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
                >
                  <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Add Members
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Search and select members to add to your group
                      </p>
                    </motion.div>

                    {/* Search Section */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search users by name or username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isSearching || !searchQuery.trim()}
                          className="px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg flex items-center gap-2 font-semibold"
                        >
                          {isSearching ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaSearch />
                          )}
                          Search
                        </motion.button>
                      </form>

                      {/* Search Results */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-inner border-2 border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <FaSearch className="text-blue-500" />
                          Search Results
                          {isSearching && (
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </h4>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {searchResults.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-8"
                            >
                              <FaUserFriends className="mx-auto text-4xl text-gray-300 mb-3" />
                              <p className="text-gray-500 dark:text-gray-400 font-medium">
                                {searchQuery ? 'No users found' : 'Start searching for users'}
                              </p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                {searchQuery ? 'Try a different search term' : 'Enter a name or username above'}
                              </p>
                            </motion.div>
                          ) : (
                            searchResults.map((user, index) => (
                              <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => addMember(user)}
                                className="flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl cursor-pointer transition-all duration-200 group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getRandomColor(user.name)} rounded-xl text-white font-semibold shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    {getInitials(user.name)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      @{user.username}
                                    </div>
                                  </div>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 text-green-500 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900"
                                >
                                  <FaUserPlus size={16} />
                                </motion.div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Selected Members */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner border-2 border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          Selected Members ({selectedMembers.length})
                        </h4>
                        {selectedMembers.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMembers([])}
                            className="px-3 py-1 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                          >
                            <FaTrash size={12} />
                            Clear All
                          </motion.button>
                        )}
                      </div>

                      {/* You as Owner */}
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                            <FaCrown size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                              {user.name}
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center gap-1">
                                <FaCrown size={8} />
                                Owner
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username} • You
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Members List */}
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {selectedMembers.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <FaUserFriends className="mx-auto text-5xl text-gray-300 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                              No members selected yet
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 mt-2">
                              Search and add members to get started
                            </p>
                          </motion.div>
                        ) : (
                          selectedMembers.map((member, index) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 group border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${getRandomColor(member.name)} rounded-xl text-white font-semibold shadow-md`}>
                                  {getInitials(member.name)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 dark:text-white">
                                    {member.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    @{member.username}
                                  </div>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeMember(member)}
                                className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
                              >
                                <IoClose size={18} />
                              </motion.button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <IoPeople />
                  <span>
                    {selectedMembers.length + 1} total members • You'll be the group owner
                  </span>
                </div>
                {selectedMembers.length >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 text-green-500 font-medium flex items-center gap-1 justify-center sm:justify-start"
                  >
                    <FaCheck />
                    Great! You're starting with a solid group
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-3 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold shadow-sm"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateGroup}
                  disabled={isLoading || !groupName.trim() || selectedMembers.length === 0}
                  className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <IoSend className="flex-shrink-0" />
                      Create Group
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}