"use client";
import { useState, useRef, useEffect } from "react";
import { FaRegSmileBeam, FaAt, FaHashtag, FaTimes } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { STYLES } from "./styles";
import TaggingDropdown from "./TaggingDropdown";

export default function MessageInput({
  newMessage,
  isLoading,
  selectedUser,
  isGroup,
  onNewMessageChange,
  onSendMessage,
  API,
  user,
  onReplyCancel,
  replyingTo,
  isConnected,
}) {
  const [showTaggingDropdown, setShowTaggingDropdown] = useState(false);
  const [taggingQuery, setTaggingQuery] = useState("");
  const [taggingPosition, setTaggingPosition] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  // Focus input when replying to a message
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // FIXED: Enhanced send handler with proper event prevention
  const handleSendMessageProtected = async (e) => {
    // CRITICAL: Prevent default form submission that causes page reload
    if (e) {
      e.preventDefault();
    }
    
    // Prevent multiple sends
    if (isSending || isLoading || !newMessage.trim() || !selectedUser) {
      return;
    }

    setIsSending(true);
    
    try {
      await onSendMessage(e);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      // Reset sending state after a short delay to prevent rapid successive sends
      setTimeout(() => setIsSending(false), 500);
    }
  };

  // FIXED: Enhanced key press handler
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // CRITICAL: Prevent form submission on Enter
      if (!showTaggingDropdown) {
        handleSendMessageProtected(e);
      }
    } else if (e.key === "@" && !showTaggingDropdown) {
      // Start tagging when @ is pressed
      e.preventDefault();
      setShowTaggingDropdown(true);
      setTaggingPosition(newMessage.length);
      setTaggingQuery("");
    } else if (showTaggingDropdown && e.key === "Escape") {
      e.preventDefault();
      setShowTaggingDropdown(false);
    } else if (showTaggingDropdown && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    onNewMessageChange(value);

    // Handle tagging logic
    if (showTaggingDropdown) {
      const textAfterAt = value.slice(taggingPosition);
      const spaceIndex = textAfterAt.indexOf(' ');
      const query = spaceIndex === -1 ? textAfterAt.slice(1) : textAfterAt.slice(1, spaceIndex);
      setTaggingQuery(query);
      
      if (query.length === 0 || value.length < taggingPosition) {
        setShowTaggingDropdown(false);
      }
    }
  };

  const handleSelectUser = (selectedUser) => {
    if (inputRef.current) {
      const beforeTag = newMessage.slice(0, taggingPosition);
      const afterTag = newMessage.slice(taggingPosition + 1 + taggingQuery.length);
      const newMessageText = `${beforeTag}@${selectedUser.username} ${afterTag}`;
      
      onNewMessageChange(newMessageText);
      setShowTaggingDropdown(false);
      setTaggingQuery("");
      inputRef.current.focus();
    }
  };

  const handleSelectAI = (prompt = "") => {
    if (inputRef.current) {
      const beforeTag = newMessage.slice(0, taggingPosition);
      const afterTag = newMessage.slice(taggingPosition + 1 + taggingQuery.length);
      
      // If a specific prompt is provided, use it
      const aiText = prompt ? `@ai ${prompt}` : "@ai ";
      
      const newMessageText = `${beforeTag}${aiText}${afterTag}`;
      
      onNewMessageChange(newMessageText);
      setShowTaggingDropdown(false);
      setTaggingQuery("");
      inputRef.current.focus();
      
      // If it's a quick prompt, auto-focus and put cursor at end for user to complete
      if (prompt) {
        setTimeout(() => {
          inputRef.current.setSelectionRange(
            newMessageText.length,
            newMessageText.length
          );
        }, 0);
      }
    }
  };

  const handleSelectEveryone = () => {
    if (inputRef.current && isGroup) {
      const beforeTag = newMessage.slice(0, taggingPosition);
      const afterTag = newMessage.slice(taggingPosition + 1 + taggingQuery.length);
      const newMessageText = `${beforeTag}@all ${afterTag}`;
      
      onNewMessageChange(newMessageText);
      setShowTaggingDropdown(false);
      setTaggingQuery("");
      inputRef.current.focus();
    }
  };

  const handleManualTagging = (e) => {
    // FIXED: Prevent any default behavior
    if (e) e.preventDefault();
    setShowTaggingDropdown(true);
    setTaggingPosition(newMessage.length);
    setTaggingQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isDisabled = isSending || isLoading || !isConnected;

  return (
    <form
      onSubmit={handleSendMessageProtected}
      className={`p-4 border-t border-gray-700/50 ${STYLES.bg.section} relative z-20`}
    >
      {/* Reply Preview */}
      {replyingTo && (
        <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs text-blue-400 font-medium mb-1">
              Replying to {replyingTo.sender_name || "message"}
            </div>
            <div className="text-sm text-blue-300 truncate">
              {replyingTo.message_content}
            </div>
          </div>
          <button
            type="button"
            onClick={onReplyCancel}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            disabled={isDisabled}
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 relative">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={
              !isConnected 
                ? "Connecting to server..."
                : replyingTo 
                  ? `Reply to ${replyingTo.sender_name}...` 
                  : `Message ${isGroup ? selectedUser?.name : selectedUser?.name}... (Type @ to mention)`
            }
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 pr-12 ${
              !isConnected 
                ? "border-red-500/50 focus:ring-red-500/50 cursor-not-allowed" 
                : "border-gray-600/50 focus:ring-blue-500/50"
            }`}
            disabled={isDisabled}
            maxLength={1000}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button" // FIXED: Always use type="button" for non-submit buttons
              onClick={handleManualTagging}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mention someone (@)"
              disabled={isDisabled}
            >
              <FaAt size={16} />
            </button>
            <button
              type="button" // FIXED: Always use type="button" for non-submit buttons
              className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add emoji"
              disabled={isDisabled}
            >
              <FaRegSmileBeam size={16} />
            </button>
          </div>

          {/* Tagging Dropdown */}
          {showTaggingDropdown && !isDisabled && (
            <TaggingDropdown
              query={taggingQuery}
              selectedUser={selectedUser}
              isGroup={isGroup}
              onSelectUser={handleSelectUser}
              onSelectAI={handleSelectAI}
              onSelectEveryone={handleSelectEveryone}
              onClose={() => setShowTaggingDropdown(false)}
              API={API}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled || !newMessage.trim()}
          className={`p-4 text-white bg-gradient-to-r rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg min-w-[60px] backdrop-blur-sm border ${
            !isConnected
              ? "from-red-600 to-red-700 border-red-500/30 cursor-not-allowed"
              : isDisabled || !newMessage.trim()
              ? "from-gray-600 to-gray-700 border-gray-600/50 cursor-not-allowed"
              : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500/30 hover:shadow-blue-500/25"
          }`}
          title={!isConnected ? "Not connected to server" : "Send message"}
        >
          {isSending || isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : !isConnected ? (
            <div className="w-5 h-5 bg-red-400 rounded-full animate-pulse"></div>
          ) : (
            <IoSend size={20} />
          )}
        </button>
      </div>
    </form>
  );
}