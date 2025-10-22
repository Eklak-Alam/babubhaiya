import { useState } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { FaEdit, FaTrash, FaUserMinus, FaCrown, FaUsers, FaCheck, FaSpinner } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function GroupInfoSidebar({
  isOpen,
  selectedUser,
  isGroup,
  isOwner,
  groupMembers,
  user,
  onClose,
  onShowAddMember,
  onShowEditGroup,
  onRemoveMember,
  onDeleteGroup,
  onLeaveGroup,
  onGroupUpdate,
}) {
  const { theme } = useTheme();
  const [loadingStates, setLoadingStates] = useState({
    removeMember: null,
    deleteGroup: false,
    leaveGroup: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Theme-based styles
  const getStyles = (theme) => ({
    // Backgrounds
    backdrop: theme === 'dark' ? 'bg-black/60' : 'bg-black/40',
    sidebar: theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95',
    border: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300',
    
    // Header
    headerBg: theme === 'dark' 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
      : 'bg-gradient-to-r from-blue-500 to-blue-600',
    
    // Text colors
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      accent: theme === 'dark' ? 'text-blue-100' : 'text-blue-50',
    },
    
    // Cards and sections
    cardBg: theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50',
    cardHover: theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50',
    sectionBg: theme === 'dark' ? 'bg-gray-750/30' : 'bg-gray-100/30',
    
    // Buttons
    button: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-500/30',
      danger: theme === 'dark' 
        ? 'hover:bg-red-500/20 border-red-500/30' 
        : 'hover:bg-red-100/50 border-red-300',
      dangerText: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      icon: theme === 'dark' 
        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
        : 'text-red-500 hover:text-red-600 hover:bg-red-100',
    },
    
    // Badges
    badge: {
      owner: theme === 'dark' 
        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
        : 'bg-yellow-100 text-yellow-700 border-yellow-300',
      you: theme === 'dark' ? 'text-green-400' : 'text-green-600',
    },
    
    // Icons
    icon: {
      edit: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      danger: theme === 'dark' ? 'text-red-400' : 'text-red-500',
    }
  });

  const STYLES = getStyles(theme);

  if (!isOpen || !isGroup) return null;

  const safeGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];

  // Show success toast
  const showToast = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 2000);
  };

  // Enhanced remove member with loading state and confirmation
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, removeMember: memberId }));
    
    try {
      await onRemoveMember(memberId, memberName);
      showToast(`✅ ${memberName} has been removed from the group!`);
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, removeMember: null }));
    }
  };

  // Enhanced delete group with loading state and confirmation
  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

    setLoadingStates(prev => ({ ...prev, deleteGroup: true }));
    
    try {
      await onDeleteGroup();
      onClose();
    } catch (error) {
      console.error("Error deleting group:", error);
      const errorMessage = error.message || "Failed to delete group";
      showToast(`❌ ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, deleteGroup: false }));
    }
  };

  // Enhanced leave group with loading state and confirmation
  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, leaveGroup: true }));
    
    try {
      await onLeaveGroup();
      showToast("✅ You have left the group!");
      onClose();
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, leaveGroup: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/30 backdrop-blur-sm flex items-center gap-3 min-w-80">
            <FaCheck className="text-white flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Group Info Sidebar */}
      <div className={`absolute inset-0 ${STYLES.backdrop} z-40 flex justify-end animate-in slide-in-from-right duration-300 transition-colors`}>
        <div
          className={`w-full md:w-96 ${STYLES.sidebar} shadow-2xl border-l ${STYLES.border} overflow-y-auto backdrop-blur-xl transition-colors duration-200`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${STYLES.border} ${STYLES.headerBg} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl">Group Information</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Manage your group settings
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={loadingStates.deleteGroup || loadingStates.leaveGroup}
                className="p-2 hover:bg-blue-600/30 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Group Details */}
          <div className={`p-6 border-b ${STYLES.border}`}>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-4 shadow-lg ring-2 ring-blue-500/30">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-xl truncate transition-colors duration-200 ${STYLES.text.primary}`}>
                  {selectedUser.name}
                </h4>
                <p className={`text-sm mt-1 transition-colors duration-200 ${STYLES.text.secondary}`}>
                  {safeGroupMembers.length} member{safeGroupMembers.length !== 1 ? 's' : ''} •
                  {selectedUser.owner_name && ` Created by ${selectedUser.owner_name}`}
                </p>
                {selectedUser.description && (
                  <p className={`text-sm mt-2 line-clamp-2 transition-colors duration-200 ${STYLES.text.muted}`}>
                    {selectedUser.description}
                  </p>
                )}
              </div>
            </div>

            {selectedUser.created_at && (
              <div className={`text-sm flex items-center gap-2 transition-colors duration-200 ${STYLES.text.muted}`}>
                <span>📅</span>
                <span>Created on {formatDate(selectedUser.created_at)}</span>
              </div>
            )}

            {selectedUser.updated_at && selectedUser.updated_at !== selectedUser.created_at && (
              <div className={`text-sm flex items-center gap-2 mt-1 transition-colors duration-200 ${STYLES.text.muted}`}>
                <span>✏️</span>
                <span>Updated on {formatDate(selectedUser.updated_at)}</span>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold text-lg transition-colors duration-200 ${STYLES.text.primary}`}>
                Group Members ({safeGroupMembers.length})
              </h4>
              {isOwner && (
                <button
                  onClick={onShowAddMember}
                  disabled={loadingStates.deleteGroup}
                  className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed ${STYLES.button.primary}`}
                >
                  <IoAdd size={16} />
                  Add Member
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {safeGroupMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border ${
                    STYLES.cardBg
                  } ${STYLES.cardHover} ${
                    loadingStates.removeMember === member.id ? 'opacity-60' : ''
                  } ${STYLES.border}`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3 text-white font-semibold shadow-md ring-1 ring-blue-500/30 flex-shrink-0">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium flex items-center gap-2 truncate transition-colors duration-200 ${STYLES.text.primary}`}>
                        <span className="truncate">{member.name}</span>
                        {member.id === selectedUser.owner_id && (
                          <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border flex-shrink-0 ${STYLES.badge.owner}`}>
                            <FaCrown size={10} />
                            Owner
                          </span>
                        )}
                      </div>
                      <div className={`text-xs flex items-center gap-2 truncate transition-colors duration-200 ${STYLES.text.secondary}`}>
                        <span className="truncate">@{member.username}</span>
                        {member.id === user.id && (
                          <span className={`flex-shrink-0 ${STYLES.badge.you}`}>(You)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isOwner && member.id !== selectedUser.owner_id && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      disabled={loadingStates.removeMember === member.id || loadingStates.deleteGroup}
                      className={`p-2 transition-all duration-200 rounded-lg backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2 ${STYLES.button.icon}`}
                      title="Remove member"
                    >
                      {loadingStates.removeMember === member.id ? (
                        <FaSpinner className="animate-spin" size={14} />
                      ) : (
                        <FaUserMinus size={16} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Group Actions */}
          <div className={`p-6 border-t ${STYLES.border} ${STYLES.sectionBg}`}>
            <h4 className={`font-semibold mb-4 text-lg transition-colors duration-200 ${STYLES.text.primary}`}>
              Group Management
            </h4>
            <div className="space-y-3">
              {isOwner ? (
                <>
                  <button
                    onClick={onShowEditGroup}
                    disabled={loadingStates.deleteGroup}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed ${STYLES.cardBg} ${STYLES.cardHover} ${STYLES.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600/20' : 'bg-gray-400/20'}`}>
                        <FaEdit className={`transition-colors duration-200 ${STYLES.icon.edit}`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors duration-200 ${STYLES.text.primary}`}>
                          Edit Group Info
                        </div>
                        <div className={`text-xs transition-colors duration-200 ${STYLES.text.muted}`}>
                          Change name and description
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    disabled={loadingStates.deleteGroup}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed ${STYLES.cardBg} ${STYLES.button.danger} ${STYLES.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-400/20'}`}>
                        {loadingStates.deleteGroup ? (
                          <FaSpinner className={`animate-spin ${STYLES.button.dangerText}`} />
                        ) : (
                          <FaTrash className={`transition-colors duration-200 ${STYLES.button.dangerText}`} />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium transition-colors duration-200 ${STYLES.button.dangerText}`}>
                          {loadingStates.deleteGroup ? 'Deleting Group...' : 'Delete Group'}
                        </div>
                        <div className={`text-xs transition-colors duration-200 ${STYLES.text.muted}`}>
                          Permanently delete this group
                        </div>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeaveGroup}
                  disabled={loadingStates.leaveGroup}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed ${STYLES.cardBg} ${STYLES.button.danger} ${STYLES.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-400/20'}`}>
                      {loadingStates.leaveGroup ? (
                        <FaSpinner className={`animate-spin ${STYLES.button.dangerText}`} />
                      ) : (
                        <FaUserMinus className={`transition-colors duration-200 ${STYLES.button.dangerText}`} />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium transition-colors duration-200 ${STYLES.button.dangerText}`}>
                        {loadingStates.leaveGroup ? 'Leaving Group...' : 'Leave Group'}
                      </div>
                      <div className={`text-xs transition-colors duration-200 ${STYLES.text.muted}`}>
                        Leave this group
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}