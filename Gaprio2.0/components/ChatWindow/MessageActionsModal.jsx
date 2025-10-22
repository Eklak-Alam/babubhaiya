import { useState, useEffect, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash, FaReply, FaRegCopy, FaCheck, FaSpinner, FaRobot } from "react-icons/fa";
import { useTheme } from '@/context/ThemeContext';

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
  const { theme } = useTheme();
  // State hooks
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    edit: false,
    copy: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95',
    modalBackground: theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95',
    modalBorder: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50',
    headerBackground: theme === 'dark' ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90' : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    card: {
      background: theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/80',
      border: theme === 'dark' ? 'border-gray-600/50' : 'border-gray-300/50',
    },
    button: {
      secondary: theme === 'dark' ? 'text-gray-300 border-gray-600/50 hover:bg-gray-700/50' : 'text-gray-700 border-gray-300/50 hover:bg-gray-100/50',
    },
    toast: theme === 'dark' ? 'bg-green-500/95 border-green-400/50 text-white' : 'bg-green-500/90 border-green-400/30 text-white'
  };

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
          <div className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 min-w-60 ${themeStyles.toast}`}>
            <FaCheck className="text-white text-sm flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
          isOpen ? `${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm` : 'bg-black/0 backdrop-blur-0'
        }`}
        onClick={onClose}
      >
        <div 
          className={`${themeStyles.modalBackground} rounded-2xl shadow-xl w-full max-w-md border ${themeStyles.modalBorder} backdrop-blur-md transform transition-all duration-200 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-5 border-b ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-blue-500/20'
          } ${themeStyles.headerBackground} text-white rounded-t-2xl`}>
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
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
          } ${theme === 'dark' ? 'bg-gray-750/20' : 'bg-gray-50/50'}`}>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Preview</span>
            </div>
            <div className={`${themeStyles.text.primary} text-sm ${
              theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/80'
            } p-3 rounded-lg border ${
              theme === 'dark' ? 'border-gray-600/30' : 'border-gray-300/50'
            } max-h-20 overflow-y-auto custom-scrollbar`}>
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {renderMessagePreview(selectedMessage)}
              </div>
            </div>
            {selectedMessage.message_content?.length > 150 && (
              <div className={`text-xs ${themeStyles.text.tertiary} mt-1 text-right`}>
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
                className={`w-full flex items-center justify-between p-3 ${
                  themeStyles.card.background
                } rounded-xl hover:bg-blue-500/20 transition-all duration-200 border ${
                  themeStyles.card.border
                } backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-blue-500/30 hover:scale-[1.01] active:scale-[0.99]`}
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
                    <div className={`font-medium ${
                      themeStyles.text.primary
                    } text-sm`}>
                      {loadingStates.edit ? 'Preparing...' : 'Edit Message'}
                    </div>
                    <div className={`text-xs ${themeStyles.text.tertiary}`}>
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
                className={`w-full flex items-center justify-between p-3 ${
                  themeStyles.card.background
                } rounded-xl hover:bg-red-500/20 transition-all duration-200 border ${
                  themeStyles.card.border
                } backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-red-500/30 hover:scale-[1.01] active:scale-[0.99]`}
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
                    <div className={`text-xs ${themeStyles.text.tertiary}`}>
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
              className={`w-full flex items-center justify-between p-3 ${
                themeStyles.card.background
              } rounded-xl hover:bg-green-500/20 transition-all duration-200 border ${
                themeStyles.card.border
              } backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group hover:border-green-500/30 hover:scale-[1.01] active:scale-[0.99]`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <FaReply className="text-green-400" size={14} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-green-400 text-sm">Reply</div>
                  <div className={`text-xs ${themeStyles.text.tertiary}`}>
                    Reply to this message
                  </div>
                </div>
              </div>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyMessage}
              disabled={isLoading}
              className={`w-full flex items-center justify-between p-3 ${
                themeStyles.card.background
              } rounded-xl ${
                theme === 'dark' ? 'hover:bg-gray-600/50' : 'hover:bg-gray-200/50'
              } transition-all duration-200 border ${
                themeStyles.card.border
              } backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group ${
                theme === 'dark' ? 'hover:border-gray-500/50' : 'hover:border-gray-400/50'
              } hover:scale-[1.01] active:scale-[0.99]`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${
                  theme === 'dark' ? 'bg-gray-600/20' : 'bg-gray-400/20'
                } rounded-lg ${
                  theme === 'dark' ? 'group-hover:bg-gray-600/30' : 'group-hover:bg-gray-400/30'
                } transition-colors`}>
                  {loadingStates.copy ? (
                    <FaSpinner className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } animate-spin`} size={14} />
                  ) : (
                    <FaRegCopy className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} size={14} />
                  )}
                </div>
                <div className="text-left">
                  <div className={`font-medium ${
                    themeStyles.text.primary
                  } text-sm`}>
                    {loadingStates.copy ? 'Copying...' : 'Copy Text'}
                  </div>
                  <div className={`text-xs ${themeStyles.text.tertiary}`}>
                    Copy to clipboard
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
          } ${theme === 'dark' ? 'bg-gray-750/20' : 'bg-gray-50/50'} rounded-b-2xl`}>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm ${
                themeStyles.button.secondary
              }`}
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
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
        }
      `}</style>
    </>
  );
}