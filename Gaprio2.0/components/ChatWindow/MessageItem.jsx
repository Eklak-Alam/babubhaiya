import { useRef, useEffect, useState } from "react";
import { FaCrown, FaCheck, FaReply, FaRegSmile, FaRegThumbsUp, FaRobot } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { formatTime, formatDate } from "./styles";
import ReactionPicker from "./ReactionPicker";
import ReactionsDisplay from "./ReactionsDisplay";

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
}) {
  const isOwnMessage = message.sender_id === user.id;
  const isAIMessage = message.is_ai_response || message.sender_id === 5;
  const showSenderInfo = isGroup && !isOwnMessage;
  const isConsecutive =
    index > 0 &&
    messages[index - 1].sender_id === message.sender_id &&
    new Date(message.timestamp) - new Date(messages[index - 1].timestamp) < 300000;

  const showDateSeparator =
    index === 0 ||
    new Date(message.timestamp).toDateString() !==
      new Date(messages[index - 1].timestamp).toDateString();

  const isEditingThisMessage = editingMessage === message.id;
  const editTextareaRef = useRef(null);
  const messageRef = useRef(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionPosition, setReactionPosition] = useState({ x: 0, y: 0 });

  // Parse tags from message
  const renderMessageWithMentions = (content) => {
    if (!content) return content;
    
    // Enhanced mention highlighting with better regex
    const mentionRegex = /(@\w+)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        // Check if it's a special mention
        const mentionText = part.toLowerCase();
        let bgColor = "bg-blue-500/20";
        let textColor = "text-blue-400";
        
        if (mentionText === '@ai' || mentionText === '@bot') {
          bgColor = "bg-purple-500/20";
          textColor = "text-purple-400";
        } else if (mentionText === '@all' || mentionText === '@everyone') {
          bgColor = "bg-green-500/20";
          textColor = "text-green-400";
        }
        
        return (
          <span key={index} className={`${textColor} font-medium ${bgColor} px-1 rounded mx-0.5`}>
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
      
      // Position the reaction picker above the message, but ensure it stays in viewport
      let top = rect.top - 10; // 10px above the message
      const pickerHeight = 60; // Approximate height of reaction picker
      
      // If too close to top, position below the message
      if (top < pickerHeight) {
        top = rect.bottom + 10;
      }
      
      setReactionPosition({
        x: rect.left + rect.width / 2,
        y: top
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

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showReactionPicker && !e.target.closest('.reaction-picker') && !e.target.closest('.message-reaction-trigger')) {
        setShowReactionPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showReactionPicker]);

  useEffect(() => {
    if (isEditingThisMessage && editTextareaRef.current) {
      const messageElement = editTextareaRef.current.closest(".message-container");
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

  // Handle message double-click for quick reactions
  const handleDoubleClick = (e) => {
    if (!isEditingThisMessage) {
      handleReactionClick(e);
    }
  };

  // Check if user has reacted to this message
  const userReaction = message.reactions?.find(r => r.user_id === user.id);

  return (
    <div className="message-container group" ref={messageRef}>
      {showDateSeparator && (
        <div className="flex justify-center my-6">
          <span
            className={`px-4 py-2 text-xs text-gray-400 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm`}
          >
            {formatDate(message.timestamp)}
          </span>
        </div>
      )}

      <div
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } ${isConsecutive ? "mt-1" : "mt-3"} group relative`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 backdrop-blur-sm relative ${
            isOwnMessage
              ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md`
              : isAIMessage
                ? `bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-bl-md`
                : `bg-gray-800/50 text-white rounded-bl-md border border-gray-700/50`
          } ${isConsecutive ? "mt-1" : "mt-2"} hover:bg-opacity-80 message-reaction-trigger`}
          onDoubleClick={handleDoubleClick}
        >
          {/* AI Badge - Show for AI messages */}
          {isAIMessage && !isConsecutive && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full flex items-center gap-1">
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
                  ? "border-blue-300 bg-blue-400/20"
                  : isAIMessage
                    ? "border-purple-300 bg-purple-400/20"
                    : "border-gray-500 bg-gray-700/30"
              }`}
            >
              <div className="font-medium truncate flex items-center gap-1">
                <FaReply size={10} className="flex-shrink-0" />
                <span>Replying to {message.reply_to_sender_name || "a message"}</span>
              </div>
              <div className="truncate text-gray-400 mt-1">
                {message.reply_to_content}
              </div>
            </div>
          )}

          {showSenderInfo && !isConsecutive && !isAIMessage && (
            <div
              className={`text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1`}
            >
              <span className="truncate">{message.sender_name}</span>
              {message.sender_id === selectedUser.owner_id && (
                <FaCrown size={10} className="text-yellow-400 flex-shrink-0" title="Group Owner" />
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
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                  className="px-3 py-2 text-gray-300 bg-gray-600/50 hover:bg-gray-600 rounded-lg transition-all duration-200"
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
              <div className="break-words leading-relaxed text-white/90 whitespace-pre-wrap">
                {renderMessageWithMentions(message.message_content)}
              </div>

              {/* Reactions Display */}
              {message.reactions && message.reactions.length > 0 && (
                <ReactionsDisplay 
                  reactions={message.reactions}
                  onReactionClick={handleReactionClick}
                  userReaction={userReaction}
                  onRemoveReaction={onRemoveReaction && message.id ? 
                    () => onRemoveReaction(message.id, isGroup) : undefined
                  }
                />
              )}

              <div
                className={`text-xs mt-2 flex items-center justify-between ${
                  isOwnMessage ? "text-blue-100/70" : isAIMessage ? "text-purple-100/70" : "text-gray-400"
                }`}
              >
                <span>{formatTime(message.timestamp)}</span>
                <div className="flex items-center gap-2">
                  {message.edited_at && (
                    <span className="text-gray-400 italic" title={`Edited at ${formatTime(message.edited_at)}`}>
                      (edited)
                    </span>
                  )}
                  {isOwnMessage && (
                    <span className="opacity-70 flex items-center gap-1" title="Read">
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
                          ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          : isAIMessage
                            ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                            : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                      } ${userReaction ? '!bg-yellow-500/20 !text-yellow-300' : ''}`}
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
                          ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          : isAIMessage
                            ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                            : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
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