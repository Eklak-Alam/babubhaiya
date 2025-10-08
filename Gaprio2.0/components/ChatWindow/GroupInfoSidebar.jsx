import { useState } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { FaEdit, FaTrash, FaUserMinus, FaCrown, FaUsers, FaCheck, FaSpinner } from "react-icons/fa";
import { STYLES, formatDate } from "./styles";

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
  onGroupUpdate, // New prop to handle group updates
}) {
  const [loadingStates, setLoadingStates] = useState({
    removeMember: null,
    deleteGroup: false,
    leaveGroup: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      // Error handling would be done in the parent component
    } finally {
      setLoadingStates(prev => ({ ...prev, removeMember: null }));
    }
  };

  // Enhanced delete group with loading state and confirmation
 // Enhanced delete group with loading state and confirmation
const handleDeleteGroup = async () => {
  if (!window.confirm("Are you sure...?")) return;

  setLoadingStates(prev => ({ ...prev, deleteGroup: true }));
  
  try {
    await onDeleteGroup();
    showToast("✅ Group deleted successfully!");
    onClose();
  } catch (error) {
    showToast(`${error.message}`);
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
      <div className="absolute inset-0 bg-black/60 z-40 flex justify-end animate-in slide-in-from-right duration-300">
        <div
          className={`w-full md:w-96 bg-gray-800/95 shadow-2xl border-l border-gray-700/50 overflow-y-auto backdrop-blur-xl`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}
          >
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
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center mb-6">
              <div
                className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-4 shadow-lg ring-2 ring-blue-500/30`}
              >
                <FaUsers className="text-white text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-white text-xl truncate`}>
                  {selectedUser.name}
                </h4>
                <p className={`text-sm text-gray-300 mt-1`}>
                  {safeGroupMembers.length} member{safeGroupMembers.length !== 1 ? 's' : ''} •
                  {selectedUser.owner_name && ` Created by ${selectedUser.owner_name}`}
                </p>
                {selectedUser.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {selectedUser.description}
                  </p>
                )}
              </div>
            </div>

            {selectedUser.created_at && (
              <div className={`text-sm text-gray-400 flex items-center gap-2`}>
                <span>📅</span>
                <span>Created on {formatDate(selectedUser.created_at)}</span>
              </div>
            )}

            {selectedUser.updated_at && selectedUser.updated_at !== selectedUser.created_at && (
              <div className={`text-sm text-gray-400 flex items-center gap-2 mt-1`}>
                <span>✏️</span>
                <span>Updated on {formatDate(selectedUser.updated_at)}</span>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold text-white text-lg`}>
                Group Members ({safeGroupMembers.length})
              </h4>
              {isOwner && (
                <button
                  onClick={onShowAddMember}
                  disabled={loadingStates.deleteGroup}
                  className={`flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg backdrop-blur-sm border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  className={`flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm ${
                    loadingStates.removeMember === member.id ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3 text-white font-semibold shadow-md ring-1 ring-blue-500/30 flex-shrink-0">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium text-white flex items-center gap-2 truncate`}
                      >
                        <span className="truncate">{member.name}</span>
                        {member.id === selectedUser.owner_id && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30 flex-shrink-0">
                            <FaCrown size={10} />
                            Owner
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs text-gray-400 flex items-center gap-2 truncate`}
                      >
                        <span className="truncate">@{member.username}</span>
                        {member.id === user.id && (
                          <span className="text-green-400 flex-shrink-0">(You)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isOwner && member.id !== selectedUser.owner_id && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      disabled={loadingStates.removeMember === member.id || loadingStates.deleteGroup}
                      className="p-2 text-red-400 hover:text-red-300 transition-all duration-200 rounded-lg hover:bg-red-500/20 backdrop-blur-sm border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
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
          <div className={`p-6 border-t border-gray-700/50 bg-gray-750/30`}>
            <h4 className={`font-semibold text-white mb-4 text-lg`}>
              Group Management
            </h4>
            <div className="space-y-3">
              {isOwner ? (
                <>
                  <button
                    onClick={onShowEditGroup}
                    disabled={loadingStates.deleteGroup}
                    className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-600/20 rounded-lg">
                        <FaEdit className="text-gray-400" />
                      </div>
                      <div>
                        <div className={`font-medium text-white`}>
                          Edit Group Info
                        </div>
                        <div className={`text-xs text-gray-400`}>
                          Change name and description
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    disabled={loadingStates.deleteGroup}
                    className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        {loadingStates.deleteGroup ? (
                          <FaSpinner className="animate-spin text-red-400" />
                        ) : (
                          <FaTrash className="text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-red-400">
                          {loadingStates.deleteGroup ? 'Deleting Group...' : 'Delete Group'}
                        </div>
                        <div className={`text-xs text-gray-400`}>
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
                  className={`w-full text-left p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      {loadingStates.leaveGroup ? (
                        <FaSpinner className="animate-spin text-red-400" />
                      ) : (
                        <FaUserMinus className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-red-400">
                        {loadingStates.leaveGroup ? 'Leaving Group...' : 'Leave Group'}
                      </div>
                      <div className={`text-xs text-gray-400`}>
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