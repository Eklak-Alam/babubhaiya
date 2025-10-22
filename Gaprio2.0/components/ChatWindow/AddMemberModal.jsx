import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, 
  FaSearch, 
  FaUserPlus, 
  FaCheck, 
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { IoClose, IoPeople } from "react-icons/io5";
import { useTheme } from '@/context/ThemeContext';

export default function AddMemberModal({
  isOpen,
  searchQuery,
  searchUsers,
  isSearching,
  groupMembers,
  onClose,
  onSearchQueryChange,
  onSearchUsers,
  onAddMember,
  selectedUser
}) {
  const { theme } = useTheme();
  const modalRef = useRef(null);
  const [localError, setLocalError] = useState("");
  const [addingUserId, setAddingUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    modalBackground: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    modalBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    headerBackground: theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    },
    input: {
      background: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
      border: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    },
    card: {
      background: theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/80',
      border: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    },
    button: {
      secondary: theme === 'dark' ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100',
    },
    error: theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700',
    success: theme === 'dark' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
  };

  // Close modal on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      setLocalError("");
      setSuccessMessage("");
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setLocalError("");
    setSuccessMessage("");
    setAddingUserId(null);
    onClose();
  }, [onClose]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setLocalError("");
    if (!searchQuery.trim()) {
      setLocalError("Please enter a search term");
      return;
    }
    if (searchQuery.trim().length < 2) {
      setLocalError("Please enter at least 2 characters");
      return;
    }
    onSearchUsers(searchQuery);
  }, [searchQuery, onSearchUsers]);

  const handleAddMember = useCallback(async (userToAdd) => {
    if (!selectedUser?.id) {
      setLocalError("No group selected");
      return;
    }

    setAddingUserId(userToAdd.id);
    setLocalError("");
    setSuccessMessage("");

    try {
      await onAddMember(userToAdd);
      setSuccessMessage(`${userToAdd.name} added successfully!`);
      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setLocalError(error.message || "Failed to add member");
    } finally {
      setAddingUserId(null);
    }
  }, [selectedUser, onAddMember]);

  const getInitials = useCallback((name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  }, []);

  const isUserAlreadyMember = useCallback((user) => {
    return groupMembers.some(member => member.id === user.id);
  }, [groupMembers]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          theme === 'dark' ? 'bg-black/70' : 'bg-black/50'
        } backdrop-blur-sm`}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-md ${themeStyles.modalBackground} rounded-2xl shadow-xl border ${themeStyles.modalBorder} max-h-[90vh] overflow-hidden`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${themeStyles.modalBorder} ${themeStyles.headerBackground} text-white`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <IoPeople className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add Members</h2>
                <p className="text-blue-100 text-sm">Search and add users to the group</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Error Message */}
            {localError && (
              <div className={`p-3 rounded-xl flex items-center gap-2 ${themeStyles.error}`}>
                <FaExclamationTriangle />
                <span className="text-sm">{localError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className={`p-3 rounded-xl flex items-center gap-2 ${themeStyles.success}`}>
                <FaCheck />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Search Section */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or username..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchQueryChange(e.target.value);
                    setLocalError("");
                  }}
                  className={`w-full pl-10 pr-4 py-3 ${themeStyles.input.background} border ${themeStyles.input.border} rounded-xl ${themeStyles.input.focus} ${
                    themeStyles.text.primary
                  } placeholder-gray-400`}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSearch />
                )}
                {isSearching ? "Searching..." : "Search Users"}
              </button>
            </form>

            {/* Search Results */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchUsers.length > 0 ? (
                searchUsers.map((user) => {
                  const isAlreadyMember = isUserAlreadyMember(user);
                  const isAdding = addingUserId === user.id;
                  
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
                      } rounded-xl ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      } transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className={`font-semibold ${themeStyles.text.primary}`}>{user.name}</div>
                          <div className={`text-sm ${themeStyles.text.secondary}`}>@{user.username}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => !isAlreadyMember && handleAddMember(user)}
                        disabled={isAlreadyMember || isAdding}
                        className={`p-2 rounded-lg transition-colors ${
                          isAlreadyMember
                            ? "text-gray-500 cursor-not-allowed"
                            : isAdding
                            ? "text-blue-400 cursor-wait"
                            : "text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        }`}
                        title={isAlreadyMember ? "Already a member" : "Add to group"}
                      >
                        {isAdding ? (
                          <FaSpinner className="animate-spin" />
                        ) : isAlreadyMember ? (
                          <FaCheck />
                        ) : (
                          <FaUserPlus />
                        )}
                      </button>
                    </div>
                  );
                })
              ) : searchQuery.trim() && !isSearching ? (
                <div className={`text-center py-4 ${themeStyles.text.secondary}`}>
                  No users found matching "{searchQuery}"
                </div>
              ) : null}
            </div>

            {/* Current Members */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className={`font-semibold ${themeStyles.text.primary} mb-3 flex items-center gap-2`}>
                <FaCheck className="text-green-400" />
                Current Members ({groupMembers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-2 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50'
                    } rounded-lg`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${themeStyles.text.primary} text-sm truncate`}>
                        {member.name}
                      </div>
                      <div className={`text-xs ${themeStyles.text.secondary} truncate`}>
                        @{member.username}
                      </div>
                    </div>
                  </div>
                ))}
                {groupMembers.length === 0 && (
                  <div className={`text-center py-2 ${themeStyles.text.secondary} text-sm`}>
                    No members yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t ${themeStyles.modalBorder} p-4 ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/80'
          }`}>
            <button
              onClick={handleClose}
              className={`w-full py-3 rounded-xl transition-all ${themeStyles.button.secondary}`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}