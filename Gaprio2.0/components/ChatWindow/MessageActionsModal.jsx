import { useState, useEffect, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash, FaReply, FaRegCopy, FaCheck, FaSpinner, FaRobot } from "react-icons/fa";

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
  // State hooks
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    edit: false,
    copy: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Callback hooks
  const renderMessagePreview = useCallback((message) => {
    if (!message?.message_content) return "No content";
    
    const content = message.message_content;
    const maxLength = 150;
    
    if (content.length <= maxLength) {
      return content;
    }
    
    return `${content.substring(0, maxLength)}...`;
  }, []);

  const showToast = useCallback((message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 2000);
  }, []);

  // Animation effects
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Early return after all hooks
  if (!isVisible || !selectedMessage) return null;

  const isOwnMessage = selectedMessage.sender_id === user.id;
  const isAIMessage = selectedMessage.is_ai_response;
  const isDeletable = isOwnMessage && !isAIMessage;
  const isLoading = loadingStates.delete || loadingStates.edit || loadingStates.copy;

  // Action handlers
  const handleEditMessage = async () => {
    if (isAIMessage) {
      showToast("🤖 Cannot edit AI responses");
      return;
    }

    setLoadingStates(prev => ({ ...prev, edit: true }));
    try {
      await onEditMessage(selectedMessage);
      showToast("📝 Ready to edit");
      onClose();
    } catch (error) {
      console.error("Edit error:", error);
      showToast("❌ Edit failed");
    } finally {
      setLoadingStates(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDeleteMessage = async () => {
    if (!isDeletable) {
      showToast("❌ Cannot delete this message");
      return;
    }

    if (!window.confirm("Delete this message permanently?\nThis action cannot be undone.")) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, delete: true }));
    try {
      await onDeleteMessage(selectedMessage.id);
      showToast("✅ Message deleted");
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("❌ Delete failed");
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  const handleCopyMessage = async () => {
    setLoadingStates(prev => ({ ...prev, copy: true }));
    try {
      await onCopyMessage(selectedMessage.message_content);
      showToast("📋 Copied to clipboard");
      setTimeout(() => onClose(), 400);
    } catch (error) {
      console.error("Copy error:", error);
      showToast("❌ Copy failed");
    } finally {
      setLoadingStates(prev => ({ ...prev, copy: false }));
    }
  };

  const handleReplyToMessage = () => {
    onReplyToMessage(selectedMessage);
    showToast("↩️ Replying to message");
    onClose();
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-green-500/95 text-white px-4 py-3 rounded-lg shadow-lg border border-green-400/50 backdrop-blur-sm flex items-center gap-2 min-w-60">
            <FaCheck className="text-white text-sm flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
          isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0'
        }`}
        onClick={onClose}
      >
        <div 
          className={`bg-gray-800/95 rounded-2xl shadow-xl w-full max-w-md border border-gray-700/50 backdrop-blur-md transform transition-all duration-200 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  {isAIMessage ? (
                    <FaRobot className="text-white text-sm" />
                  ) : (
                    <FaEdit className="text-white text-sm" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Message Actions</h3>
                  <p className="text-blue-100/80 text-xs mt-0.5">
                    {isAIMessage ? "AI Response Actions" : "Manage your message"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="p-4 border-b border-gray-700/50 bg-gray-750/20">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Preview</span>
            </div>
            <div className="text-white text-sm bg-gray-700/30 p-3 rounded-lg border border-gray-600/30 max-h-20 overflow-y-auto custom-scrollbar">
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {renderMessagePreview(selectedMessage)}
              </div>
            </div>
            {selectedMessage.message_content?.length > 150 && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                {selectedMessage.message_content.length} chars • Truncated
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="p-4 space-y-3">
            {/* Edit Message */}
            {isOwnMessage && !isAIMessage && (
              <button
                onClick={handleEditMessage}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 bg-gray-700/30 rounded-xl hover:bg-blue-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-blue-500/30 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    {loadingStates.edit ? (
                      <FaSpinner className="text-blue-400 animate-spin" size={14} />
                    ) : (
                      <FaEdit className="text-blue-400" size={14} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white text-sm">
                      {loadingStates.edit ? 'Preparing...' : 'Edit Message'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Modify message content
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Delete Message */}
            {isDeletable && (
              <button
                onClick={handleDeleteMessage}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 bg-gray-700/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-red-500/30 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    {loadingStates.delete ? (
                      <FaSpinner className="text-red-400 animate-spin" size={14} />
                    ) : (
                      <FaTrash className="text-red-400" size={14} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-red-400 text-sm">
                      {loadingStates.delete ? 'Deleting...' : 'Delete Message'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Remove permanently
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Reply */}
            <button
              onClick={handleReplyToMessage}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3 bg-gray-700/30 rounded-xl hover:bg-green-500/20 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-green-500/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <FaReply className="text-green-400" size={14} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-green-400 text-sm">Reply</div>
                  <div className="text-xs text-gray-400">
                    Reply to this message
                  </div>
                </div>
              </div>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyMessage}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3 bg-gray-700/30 rounded-xl hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-gray-500/50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-600/20 rounded-lg group-hover:bg-gray-600/30 transition-colors">
                  {loadingStates.copy ? (
                    <FaSpinner className="text-gray-400 animate-spin" size={14} />
                  ) : (
                    <FaRegCopy className="text-gray-400" size={14} />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-white text-sm">
                    {loadingStates.copy ? 'Copying...' : 'Copy Text'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Copy to clipboard
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-750/20 rounded-b-2xl">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500/50 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}