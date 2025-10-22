// src/components/chat/MessageItem.jsx (Updated)
import { useRef, useEffect, useState } from "react";
import {
  FaCrown,
  FaCheck,
  FaReply,
  FaRegSmile,
  FaRegThumbsUp,
  FaRobot,
} from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { formatTime, formatDate } from "./styles";
import ReactionPicker from "./ReactionPicker";
import ReactionsDisplay from "./ReactionsDisplay";
import AILoadingIndicator from "./AILoadingIndicator";
import { useTheme } from '@/context/ThemeContext';

export default function MessageItem({
  message,
  index,
  messages,
  user,
  selectedUser,
  isGroup,
  editingMessage,
  editMessageContent,
  onEditMessage,
  onEditMessageContent,
  onSaveEdit,
  onOpenMessageActions,
  onAddReaction,
  onRemoveReaction,
  isAIResponding = false,
}) {
  const { theme } = useTheme();
  const isAIMessage = message.is_ai_response || message.sender_id === 5;
  const isOwnMessage = message.sender_id === user.id && !isAIMessage;
  const showSenderInfo = isGroup && !isOwnMessage;
  const isConsecutive =
    index > 0 &&
    messages[index - 1].sender_id === message.sender_id &&
    new Date(message.timestamp) - new Date(messages[index - 1].timestamp) <
      300000;

  const showDateSeparator =
    index === 0 ||
    new Date(message.timestamp).toDateString() !==
      new Date(messages[index - 1].timestamp).toDateString();

  const isEditingThisMessage = editingMessage === message.id;
  const editTextareaRef = useRef(null);
  const messageRef = useRef(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionPosition, setReactionPosition] = useState({ x: 0, y: 0 });

  // Theme-based styles
  const themeStyles = {
    background: {
      own: theme === 'dark' 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
        : 'bg-gradient-to-r from-blue-500 to-blue-600',
      ai: theme === 'dark' 
        ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
        : 'bg-gradient-to-r from-purple-500 to-purple-600',
      other: theme === 'dark' 
        ? 'bg-gray-800/50' 
        : 'bg-gray-100/80',
    },
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      timestamp: {
        own: theme === 'dark' ? 'text-blue-100/70' : 'text-blue-50/90',
        ai: theme === 'dark' ? 'text-purple-100/70' : 'text-purple-50/90',
        other: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      }
    },
    border: {
      own: theme === 'dark' ? 'border-blue-400/20' : 'border-blue-400/30',
      ai: theme === 'dark' ? 'border-purple-400/20' : 'border-purple-400/30',
      other: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50',
    },
    card: {
      background: theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-200/50',
      border: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50',
    },
    button: {
      own: theme === 'dark' 
        ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
      ai: theme === 'dark' 
        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
      other: theme === 'dark' 
        ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30' 
        : 'bg-gray-400/20 text-gray-500 hover:bg-gray-400/30',
    }
  };

  // Check if this is a pending AI response
  const isPendingAI = message.is_pending_ai && isAIResponding;

  // Parse tags from message
  const renderMessageWithMentions = (content) => {
    if (!content) return content;

    const mentionRegex = /(@\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const mentionText = part.toLowerCase();
        let bgColor = theme === 'dark' ? "bg-blue-500/20" : "bg-blue-500/15";
        let textColor = theme === 'dark' ? "text-blue-400" : "text-blue-600";

        if (mentionText === "@ai" || mentionText === "@bot") {
          bgColor = theme === 'dark' ? "bg-purple-500/20" : "bg-purple-500/15";
          textColor = theme === 'dark' ? "text-purple-400" : "text-purple-600";
        } else if (mentionText === "@all" || mentionText === "@everyone") {
          bgColor = theme === 'dark' ? "bg-green-500/20" : "bg-green-500/15";
          textColor = theme === 'dark' ? "text-green-400" : "text-green-600";
        }

        return (
          <span
            key={index}
            className={`${textColor} font-medium ${bgColor} px-1 rounded mx-0.5`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleReactionClick = (e) => {
    e.stopPropagation();

    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let top = rect.top - 10;
      const pickerHeight = 60;

      if (top < pickerHeight) {
        top = rect.bottom + 10;
      }

      setReactionPosition({
        x: rect.left + rect.width / 2,
        y: top,
      });
      setShowReactionPicker(true);
    }
  };

  const handleAddReaction = async (reaction) => {
    if (onAddReaction) {
      await onAddReaction(message.id, reaction, isGroup);
    }
    setShowReactionPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showReactionPicker &&
        !e.target.closest(".reaction-picker") &&
        !e.target.closest(".message-reaction-trigger")
      ) {
        setShowReactionPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showReactionPicker]);

  useEffect(() => {
    if (isEditingThisMessage && editTextareaRef.current) {
      const messageElement =
        editTextareaRef.current.closest(".message-container");
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isEditingThisMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onEditMessage(null);
      onEditMessageContent("");
    } else if (e.key === "Enter" && e.ctrlKey) {
      onSaveEdit(message.id, editMessageContent);
    }
  };

  const handleDoubleClick = (e) => {
    if (!isEditingThisMessage) {
      handleReactionClick(e);
    }
  };

  const userReaction = message.reactions?.find((r) => r.user_id === user.id);

  return (
    <div className="message-container group" ref={messageRef}>
      {showDateSeparator && (
        <div className="flex justify-center my-6">
          <span
            className={`px-4 py-2 text-xs ${
              theme === 'dark' ? 'text-gray-400 bg-gray-800/50' : 'text-gray-500 bg-gray-200/80'
            } rounded-full border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
            } backdrop-blur-sm`}
          >
            {formatDate(message.timestamp)}
          </span>
        </div>
      )}

      <div
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${
          isConsecutive ? "mt-1" : "mt-3"
        } group relative`}
      >
        {/* Show AI Loading Indicator for pending AI responses */}
        {isPendingAI ? (
          <AILoadingIndicator />
        ) : (
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 backdrop-blur-sm relative ${
              isOwnMessage
                ? `${themeStyles.background.own} text-white rounded-br-md`
                : isAIMessage
                ? `${themeStyles.background.ai} text-white rounded-bl-md`
                : `${themeStyles.background.other} ${
                    themeStyles.text.primary
                  } rounded-bl-md border ${themeStyles.border.other}`
            } ${
              isConsecutive ? "mt-1" : "mt-2"
            } hover:bg-opacity-80 message-reaction-trigger`}
            onDoubleClick={handleDoubleClick}
          >
            {/* AI Badge - Show for AI messages */}
            {isAIMessage && !isConsecutive && (
              <div className="flex items-center gap-1 mb-1">
                <span className={`text-xs ${
                  theme === 'dark' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'bg-purple-500/15 text-purple-600'
                } px-2 py-1 rounded-full flex items-center gap-1`}>
                  <FaRobot size={10} />
                  Accord AI
                </span>
              </div>
            )}

            {/* Reply Context */}
            {message.reply_to && (
              <div
                className={`text-xs mb-2 p-2 rounded-lg border-l-2 ${
                  isOwnMessage
                    ? `${
                        theme === 'dark' 
                          ? "border-blue-300 bg-blue-400/20" 
                          : "border-blue-400 bg-blue-500/15"
                      }`
                    : isAIMessage
                    ? `${
                        theme === 'dark' 
                          ? "border-purple-300 bg-purple-400/20" 
                          : "border-purple-400 bg-purple-500/15"
                      }`
                    : `${
                        theme === 'dark' 
                          ? "border-gray-500 bg-gray-700/30" 
                          : "border-gray-400 bg-gray-300/50"
                      }`
                }`}
              >
                <div className={`font-medium truncate flex items-center gap-1 ${
                  themeStyles.text.primary
                }`}>
                  <FaReply size={10} className="flex-shrink-0" />
                  <span>
                    Replying to {message.reply_to_sender_name || "a message"}
                  </span>
                </div>
                <div className={`truncate mt-1 ${
                  themeStyles.text.tertiary
                }`}>
                  {message.reply_to_content}
                </div>
              </div>
            )}

            {showSenderInfo && !isConsecutive && !isAIMessage && (
              <div
                className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                  themeStyles.text.secondary
                }`}
              >
                <span className="truncate">{message.sender_name}</span>
                {message.sender_id === selectedUser.owner_id && (
                  <FaCrown
                    size={10}
                    className="text-yellow-400 flex-shrink-0"
                    title="Group Owner"
                  />
                )}
              </div>
            )}

            {isEditingThisMessage ? (
              <div className="space-y-3">
                <textarea
                  ref={editTextareaRef}
                  data-editing="true"
                  value={editMessageContent}
                  onChange={(e) => onEditMessageContent(e.target.value)}
                  className={`w-full p-3 ${
                    themeStyles.card.background
                  } border ${
                    themeStyles.card.border
                  } rounded-lg ${
                    themeStyles.text.primary
                  } resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  rows="3"
                  placeholder="Edit your message..."
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <div className="flex gap-2 justify-end text-sm">
                  <button
                    onClick={() => {
                      onEditMessage(null);
                      onEditMessageContent("");
                    }}
                    className={`px-3 py-2 ${
                      themeStyles.text.secondary
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-600/50 hover:bg-gray-600' 
                        : 'bg-gray-300/50 hover:bg-gray-400/50'
                    } rounded-lg transition-all duration-200`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSaveEdit(message.id, editMessageContent)}
                    disabled={!editMessageContent.trim()}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`break-words leading-relaxed whitespace-pre-wrap ${
                  isOwnMessage || isAIMessage ? 'text-white/90' : themeStyles.text.primary
                }`}>
                  {renderMessageWithMentions(message.message_content)}
                </div>

                {/* Reactions Display */}
                {message.reactions && message.reactions.length > 0 && (
                  <ReactionsDisplay
                    reactions={message.reactions}
                    onReactionClick={handleReactionClick}
                    userReaction={userReaction}
                    onRemoveReaction={
                      onRemoveReaction && message.id
                        ? () => onRemoveReaction(message.id, isGroup)
                        : undefined
                    }
                  />
                )}

                <div
                  className={`text-xs mt-2 flex items-center justify-between ${
                    isOwnMessage
                      ? themeStyles.text.timestamp.own
                      : isAIMessage
                      ? themeStyles.text.timestamp.ai
                      : themeStyles.text.timestamp.other
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  <div className="flex items-center gap-2">
                    {message.edited_at && (
                      <span
                        className={themeStyles.text.tertiary}
                        title={`Edited at ${formatTime(message.edited_at)}`}
                      >
                        (edited)
                      </span>
                    )}
                    {isOwnMessage && (
                      <span
                        className="opacity-70 flex items-center gap-1"
                        title="Read"
                      >
                        <FaCheck size={10} />
                        <FaCheck size={10} className="-ml-2" />
                      </span>
                    )}

                    {/* Reaction & Actions Button */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleReactionClick}
                        className={`p-1.5 rounded-lg transition-all duration-200 message-reaction-trigger ${
                          isOwnMessage
                            ? themeStyles.button.own
                            : isAIMessage
                            ? themeStyles.button.ai
                            : themeStyles.button.other
                        } ${
                          userReaction
                            ? `${
                                theme === 'dark' 
                                  ? "!bg-yellow-500/20 !text-yellow-300" 
                                  : "!bg-yellow-500/15 !text-yellow-600"
                              }`
                            : ""
                        }`}
                        title="Add reaction"
                      >
                        <FaRegSmile size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMessageActions(message);
                        }}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          isOwnMessage
                            ? themeStyles.button.own
                            : isAIMessage
                            ? themeStyles.button.ai
                            : themeStyles.button.other
                        }`}
                        title="Message actions"
                      >
                        <IoEllipsisVertical size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Reaction Picker */}
      {showReactionPicker && (
        <ReactionPicker
          position={reactionPosition}
          onSelectReaction={handleAddReaction}
          onClose={() => setShowReactionPicker(false)}
          currentReaction={userReaction?.reaction}
        />
      )}
    </div>
  );
}