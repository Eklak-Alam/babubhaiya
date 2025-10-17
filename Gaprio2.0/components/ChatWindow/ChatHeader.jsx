// components/ChatHeader.js

import { useState } from "react";
import {
  FaUsers,
  FaInfoCircle,
  FaPhone,
  FaVideo,
  FaTrash,
  FaCrown,
  FaRobot,
  FaExclamationTriangle, // Import new icon
  FaTools, // Import new icon
} from "react-icons/fa";
import { STYLES } from "./styles";
import AnalyzeResponseModal from "./AnalyzeResponseModal";
import ConfirmationModal from "./ConfirmationModal"; // Import the new modal

export default function ChatHeader({
  selectedUser,
  isGroup,
  isOwner,
  groupMembers,
  onShowGroupInfo,
  onClearConversation,
  onStartVoiceCall,
  onStartVideoCall,
  onAnalyzeChat,
  isAnalyzing = false, // This prop is still here from your code
}) {
  // --- AI Analysis Modal State ---
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // --- NEW Confirmation Modal State ---
  // This one state will handle ALL other modals
  const [modalContent, setModalContent] = useState(null); // null or { title, message, ... }

  const safeGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];

  // --- AI Analysis Handler (Unchanged) ---
  const handleAnalyzeChat = async () => {
    setAnalyzing(true);
    setShowAnalysisModal(true);
    setAnalysisData(null); // Clear old data

    try {
      const result = await onAnalyzeChat();
      setAnalysisData(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisData({
        summary: "Analysis failed. Please try again.",
        insights: [
          error.message || "Unable to process conversation at this time.",
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setAnalysisData(null);
  };

  // --- NEW Handlers for other modals ---

  const handleVoiceCallClick = () => {
    setModalContent({
      title: "Feature Coming Soon",
      message:
        "We're busy building this feature! Voice calls will be available soon.",
      confirmText: "Got it!",
      onConfirm: () => setModalContent(null),
      icon: FaTools,
      confirmClass: "bg-blue-500 hover:bg-blue-600",
    });
  };

  const handleVideoCallClick = () => {
    setModalContent({
      title: "Feature Coming Soon",
      message:
        "We're busy building this feature! Video calls will be available soon.",
      confirmText: "Got it!",
      onConfirm: () => setModalContent(null),
      icon: FaTools,
      confirmClass: "bg-blue-500 hover:bg-blue-600",
    });
  };

  const handleClearChatClick = () => {
    setModalContent({
      title: "Clear Conversation?",
      message:
        "Are you sure you want to permanently delete all messages in this chat? This action cannot be undone.",
      confirmText: "Clear Chat",
      cancelText: "Cancel",
      onConfirm: handleConfirmClear, // Call the function that calls the prop
      icon: FaExclamationTriangle,
      confirmClass: "bg-red-600 hover:bg-red-700", // Make the button red
    });
  };

  // This runs the function from the parent AND closes the modal
  const handleConfirmClear = () => {
    onClearConversation();
    setModalContent(null);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${STYLES.bg.section} relative z-10`}
      >
        {/* ... (Your existing user/group info JSX - no changes needed) ... */}
        <div className="flex items-center min-w-0">
          {isGroup ? (
            <>
              <div
                className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-3 shadow-lg ring-2 ring-blue-500/30 flex-shrink-0`}
              >
                <FaUsers className="text-white text-lg" />
              </div>
              <div className="min-w-0">
                <h2 className={`font-bold text-white text-lg truncate`}>
                  {selectedUser.name}
                </h2>
                <div className="flex items-center gap-2">
                  <p className={`text-sm text-gray-300`}>
                    {safeGroupMembers.length > 0
                      ? safeGroupMembers.length
                      : "..."}{" "}
                    members
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
              <div
                className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-3 shadow-lg ring-2 ring-blue-500/30 flex-shrink-0`}
              >
                <span className="font-semibold text-white text-lg">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className={`font-bold text-white text-lg truncate`}>
                  {selectedUser.name}
                </h2>
                <p className={`text-sm text-gray-300 flex items-center gap-2`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </>
          )}
        </div>

        {/* --- Updated Button Clicks --- */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAnalyzeChat}
            disabled={analyzing}
            className="p-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Analyze conversation with AI"
          >
            {analyzing ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaRobot size={16} />
            )}
            <span className="text-sm hidden sm:inline">
              {analyzing ? "Analyzing..." : "AI Analysis"}
            </span>
          </button>

          {!isGroup && (
            <>
              <button
                onClick={handleVoiceCallClick} // Updated
                className={`p-3 text-gray-300 hover:text-green-400 transition-all duration-200 rounded-xl hover:bg-gray-700/50`}
                title="Voice Call"
              >
                <FaPhone size={18} />
              </button>
              <button
                onClick={handleVideoCallClick} // Updated
                className={`p-3 text-gray-300 hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-gray-700/50`}
                title="Video Call"
              >
                <FaVideo size={18} />
              </button>

              <button
                onClick={handleClearChatClick} // Updated
                className={`flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-all duration-200 rounded-xl hover:bg-red-500/20 border border-red-500/30`}
              >
                <FaTrash size={14} />
                <span className="hidden sm:inline text-sm font-medium">
                  Clear Chat
                </span>
              </button>
            </>
          )}

          {isGroup && (
            <button
              onClick={onShowGroupInfo}
              className={`flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-700/50 border border-gray-600/30`}
            >
              <FaInfoCircle size={16} />
              <span className="hidden sm:inline text-sm font-medium">
                Group Info
              </span>
            </button>
          )}
        </div>
      </div>

      {/* --- Render ALL Modals --- */}

      {/* 1. AI Analysis Modal (Existing) */}
      <AnalyzeResponseModal
        isOpen={showAnalysisModal}
        onClose={closeAnalysisModal}
        analysisData={analysisData}
        isLoading={analyzing}
      />

      {/* 2. New Confirmation Modal (handles all other cases) */}
      <ConfirmationModal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
        {...modalContent} // Spread all props (title, message, onConfirm, etc.)
      />
    </>
  );
}
