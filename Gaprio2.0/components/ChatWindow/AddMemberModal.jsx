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
  const modalRef = useRef(null);
  const [localError, setLocalError] = useState("");
  const [addingUserId, setAddingUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gray-800 rounded-2xl shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <IoPeople className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add Members</h2>
                <p className="text-blue-100 text-sm">Search and add users to the group</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-blue-600/30 rounded-xl transition-all"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Error Message */}
            {localError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400">
                <FaExclamationTriangle />
                <span className="text-sm">{localError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400">
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
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
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">@{user.username}</div>
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
                <div className="text-center py-4 text-gray-400">
                  No users found matching "{searchQuery}"
                </div>
              ) : null}
            </div>

            {/* Current Members */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <FaCheck className="text-green-400" />
                Current Members ({groupMembers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        @{member.username}
                      </div>
                    </div>
                  </div>
                ))}
                {groupMembers.length === 0 && (
                  <div className="text-center py-2 text-gray-400 text-sm">
                    No members yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/50">
            <button
              onClick={handleClose}
              className="w-full py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}