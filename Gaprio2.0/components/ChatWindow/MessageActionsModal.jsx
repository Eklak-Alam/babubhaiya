import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash, FaReply, FaRegCopy, FaCheck, FaSpinner } from "react-icons/fa";
import { STYLES } from "./styles";

export default function MessageActionsModal({
  isOpen,
  selectedMessage,
  user,
  onClose,
  onEditMessage,
  onDeleteMessage,
  onCopyMessage,
  onReplyToMessage,
}) {
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    edit: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen || !selectedMessage) return null;

  const isOwnMessage = selectedMessage.sender_id === user.id;

  // Show success toast
  const showToast = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 2000);
  };

  // In MessageActionsModal component, update the handleEditMessage function:
const handleEditMessage = async () => {
    setLoadingStates(prev => ({ ...prev, edit: true }));
    try {
        // Just pass the message to parent, don't try to edit here
        await onEditMessage(selectedMessage);
        showToast("📝 Ready to edit message");
        onClose();
    } catch (error) {
        console.error("Error preparing edit:", error);
        showToast("❌ Failed to edit message");
    } finally {
        setLoadingStates(prev => ({ ...prev, edit: false }));
    }
};

  // Handle delete message with confirmation
  const handleDeleteMessage = async () => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, delete: true }));
    try {
      await onDeleteMessage(selectedMessage.id);
      showToast("✅ Message deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("❌ Failed to delete message");
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  // Handle copy message with feedback
  const handleCopyMessage = async () => {
    try {
      await onCopyMessage(selectedMessage.message_content);
      showToast("📋 Message copied to clipboard");
      onClose();
    } catch (error) {
      console.error("Error copying message:", error);
      showToast("❌ Failed to copy message");
    }
  };

  // Handle reply to message
  const handleReplyToMessage = () => {
    onReplyToMessage(selectedMessage);
    showToast("↩️ Replying to message");
    onClose();
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-60 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/30 backdrop-blur-sm flex items-center gap-3 min-w-80">
            <FaCheck className="text-white flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div
          className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-xl transform animate-in zoom-in-95 duration-300`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Message Actions</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Choose an action for this message
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={loadingStates.delete || loadingStates.edit}
                className="p-2 hover:bg-blue-600/30 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="p-4 border-b border-gray-700/50 bg-gray-750/30">
            <div className="text-sm text-gray-400 mb-1">Message preview:</div>
            <div className="text-white text-sm line-clamp-2 bg-gray-700/30 p-3 rounded-lg border border-gray-600/30">
              {selectedMessage.message_content}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            {isOwnMessage && (
              <>
                {/* Edit Message Button */}
                <button
                  onClick={handleEditMessage}
                  disabled={loadingStates.delete || loadingStates.edit}
                  className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-blue-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      {loadingStates.edit ? (
                        <FaSpinner className="text-blue-400 animate-spin" size={14} />
                      ) : (
                        <FaEdit className="text-blue-400" size={14} />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium text-white`}>
                        {loadingStates.edit ? 'Preparing Edit...' : 'Edit Message'}
                      </div>
                      <div className={`text-xs text-gray-400`}>
                        Modify your message
                      </div>
                    </div>
                  </div>
                </button>

                {/* Delete Message Button */}
                <button
                  onClick={handleDeleteMessage}
                  disabled={loadingStates.delete || loadingStates.edit}
                  className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                      {loadingStates.delete ? (
                        <FaSpinner className="text-red-400 animate-spin" size={14} />
                      ) : (
                        <FaTrash className="text-red-400" size={14} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-red-400">
                        {loadingStates.delete ? 'Deleting...' : 'Delete Message'}
                      </div>
                      <div className={`text-xs text-gray-400`}>
                        Permanently delete
                      </div>
                    </div>
                  </div>
                </button>
              </>
            )}

            {/* Reply Button */}
            <button
              onClick={handleReplyToMessage}
              disabled={loadingStates.delete || loadingStates.edit}
              className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-green-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <FaReply className="text-green-400" size={14} />
                </div>
                <div>
                  <div className={`font-medium text-green-400`}>Reply</div>
                  <div className={`text-xs text-gray-400`}>
                    Reply to this message
                  </div>
                </div>
              </div>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyMessage}
              disabled={loadingStates.delete || loadingStates.edit}
              className={`w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-600/20 rounded-lg group-hover:bg-gray-600/30 transition-colors">
                  <FaRegCopy className="text-gray-400" size={14} />
                </div>
                <div>
                  <div className={`font-medium text-white`}>Copy Text</div>
                  <div className={`text-xs text-gray-400`}>
                    Copy message content
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-750/30 rounded-b-2xl">
            <button
              onClick={onClose}
              disabled={loadingStates.delete || loadingStates.edit}
              className={`w-full px-4 py-3 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}