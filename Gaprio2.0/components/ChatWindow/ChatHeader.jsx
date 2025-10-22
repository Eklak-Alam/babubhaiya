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
  FaExclamationTriangle,
  FaTools,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import AnalyzeResponseModal from "./AnalyzeResponseModal";
import ConfirmationModal from "./ConfirmationModal";

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
  isAnalyzing = false,
}) {
  const { theme } = useTheme();
  
  // Theme-based styles
  const getStyles = (theme) => ({
    container: `
      flex items-center justify-between p-3 md:p-4 
      border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'} 
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} 
      relative z-10
      transition-colors duration-200
    `,
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      accent: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      danger: theme === 'dark' ? 'text-red-400' : 'text-red-600',
    },
    button: {
      base: `
        p-2 md:p-3 rounded-lg transition-all duration-200 
        flex items-center gap-1 md:gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      analysis: `
        ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} 
        ${theme === 'dark' ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100'}
      `,
      call: `
        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} 
        ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'}
      `,
      voiceCall: `${theme === 'dark' ? 'hover:text-green-400' : 'hover:text-green-600'}`,
      videoCall: `${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'}`,
      danger: `
        ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} 
        ${theme === 'dark' ? 'hover:bg-red-500/20 border-red-500/30' : 'hover:bg-red-100 border-red-300'} 
        border
      `,
      info: `
        ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} 
        ${theme === 'dark' ? 'hover:bg-gray-700/50 border-gray-600/30' : 'hover:bg-gray-200 border-gray-300'} 
        border
      `
    },
    badge: {
      owner: `
        px-2 py-1 text-xs rounded-full flex items-center gap-1 border
        ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}
      `,
      online: `
        w-2 h-2 rounded-full animate-pulse
        ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'}
      `
    },
    avatar: `
      flex items-center justify-center w-10 h-10 md:w-12 md:h-12 
      bg-gradient-to-br from-blue-500 to-blue-600 
      rounded-xl md:rounded-2xl mr-2 md:mr-3 
      shadow-lg ring-2 ring-blue-500/30 
      flex-shrink-0
    `
  });

  const STYLES = getStyles(theme);

  // --- AI Analysis Modal State ---
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // --- NEW Confirmation Modal State ---
  const [modalContent, setModalContent] = useState(null);

  const safeGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];

  // --- AI Analysis Handler (Unchanged) ---
  const handleAnalyzeChat = async () => {
    setAnalyzing(true);
    setShowAnalysisModal(true);
    setAnalysisData(null);

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
      message: "We're busy building this feature! Voice calls will be available soon.",
      confirmText: "Got it!",
      onConfirm: () => setModalContent(null),
      icon: FaTools,
      confirmClass: "bg-blue-500 hover:bg-blue-600",
    });
  };

  const handleVideoCallClick = () => {
    setModalContent({
      title: "Feature Coming Soon",
      message: "We're busy building this feature! Video calls will be available soon.",
      confirmText: "Got it!",
      onConfirm: () => setModalContent(null),
      icon: FaTools,
      confirmClass: "bg-blue-500 hover:bg-blue-600",
    });
  };

  const handleClearChatClick = () => {
    setModalContent({
      title: "Clear Conversation?",
      message: "Are you sure you want to permanently delete all messages in this chat? This action cannot be undone.",
      confirmText: "Clear Chat",
      cancelText: "Cancel",
      onConfirm: handleConfirmClear,
      icon: FaExclamationTriangle,
      confirmClass: "bg-red-600 hover:bg-red-700",
    });
  };

  const handleConfirmClear = () => {
    onClearConversation();
    setModalContent(null);
  };

  return (
    <>
      <div className={STYLES.container}>
        {/* User/Group Info */}
        <div className="flex items-center min-w-0 flex-1">
          {isGroup ? (
            <>
              <div className={STYLES.avatar}>
                <FaUsers className="text-white text-sm md:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`font-bold text-lg truncate ${STYLES.text.primary}`}>
                  {selectedUser.name}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm ${STYLES.text.secondary}`}>
                    {safeGroupMembers.length > 0
                      ? safeGroupMembers.length
                      : "..."}{" "}
                    members
                  </p>
                  {isOwner && (
                    <span className={STYLES.badge.owner}>
                      <FaCrown size={10} />
                      <span className="hidden xs:inline">Owner</span>
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={STYLES.avatar}>
                <span className="font-semibold text-white text-sm md:text-lg">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`font-bold text-lg truncate ${STYLES.text.primary}`}>
                  {selectedUser.name}
                </h2>
                <p className={`text-sm flex items-center gap-2 ${STYLES.text.secondary}`}>
                  <span className={STYLES.badge.online}></span>
                  <span>Online</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* AI Analysis Button */}
          <button
            onClick={handleAnalyzeChat}
            disabled={analyzing}
            className={`${STYLES.button.base} ${STYLES.button.analysis}`}
            title="Analyze conversation with AI"
          >
            {analyzing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaRobot size={14} className="md:size-[16px]" />
            )}
            <span className="text-xs md:text-sm hidden sm:inline">
              {analyzing ? "Analyzing..." : "AI Analysis"}
            </span>
          </button>

          {/* Voice/Video Call Buttons (only for individual chats) */}
          {!isGroup && (
            <>
              <button
                onClick={handleVoiceCallClick}
                className={`${STYLES.button.base} ${STYLES.button.call} ${STYLES.button.voiceCall}`}
                title="Voice Call"
              >
                <FaPhone size={16} className="md:size-[18px]" />
              </button>

              <button
                onClick={handleVideoCallClick}
                className={`${STYLES.button.base} ${STYLES.button.call} ${STYLES.button.videoCall}`}
                title="Video Call"
              >
                <FaVideo size={16} className="md:size-[18px]" />
              </button>

              <button
                onClick={handleClearChatClick}
                className={`${STYLES.button.base} ${STYLES.button.danger} px-3 py-2`}
                title="Clear Chat"
              >
                <FaTrash size={12} className="md:size-[14px]" />
                <span className="text-xs md:text-sm hidden sm:inline font-medium">
                  Clear Chat
                </span>
              </button>
            </>
          )}

          {/* Group Info Button (only for groups) */}
          {isGroup && (
            <button
              onClick={onShowGroupInfo}
              className={`${STYLES.button.base} ${STYLES.button.info} px-3 py-2`}
              title="Group Info"
            >
              <FaInfoCircle size={14} className="md:size-[16px]" />
              <span className="text-xs md:text-sm hidden sm:inline font-medium">
                Group Info
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnalyzeResponseModal
        isOpen={showAnalysisModal}
        onClose={closeAnalysisModal}
        analysisData={analysisData}
        isLoading={analyzing}
        theme={theme}
      />

      <ConfirmationModal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
        {...modalContent}
        theme={theme}
      />
    </>
  );
}