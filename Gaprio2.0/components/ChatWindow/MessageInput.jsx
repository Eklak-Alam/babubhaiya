// MessageInput.js
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
}) {
  const [showTaggingDropdown, setShowTaggingDropdown] = useState(false);
  const [taggingQuery, setTaggingQuery] = useState("");
  const [taggingPosition, setTaggingPosition] = useState(0);
  const inputRef = useRef(null);

  // Focus input when replying to a message
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!showTaggingDropdown) {
        onSendMessage(e);
      }
    } else if (e.key === "@" && !showTaggingDropdown) {
      // Start tagging when @ is pressed
      e.preventDefault();
      setShowTaggingDropdown(true);
      setTaggingPosition(newMessage.length);
      setTaggingQuery("");
    } else if (showTaggingDropdown && e.key === "Escape") {
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

  const handleSelectAI = () => {
    if (inputRef.current) {
      const beforeTag = newMessage.slice(0, taggingPosition);
      const afterTag = newMessage.slice(taggingPosition + 1 + taggingQuery.length);
      const newMessageText = `${beforeTag}@ai ${afterTag}`;
      
      onNewMessageChange(newMessageText);
      setShowTaggingDropdown(false);
      setTaggingQuery("");
      inputRef.current.focus();
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

  const handleManualTagging = () => {
    setShowTaggingDropdown(true);
    setTaggingPosition(newMessage.length);
    setTaggingQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={onSendMessage}
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
              replyingTo 
                ? `Reply to ${replyingTo.sender_name}...` 
                : `Message ${isGroup ? selectedUser?.name : selectedUser?.name}... (Type @ to mention)`
            }
            className={`w-full p-4 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 pr-12`}
            disabled={isLoading}
            maxLength={1000}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualTagging}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/20"
              title="Mention someone (@)"
            >
              <FaAt size={16} />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-500/20"
              title="Add emoji"
            >
              <FaRegSmileBeam size={16} />
            </button>
          </div>

          {/* Tagging Dropdown */}
          {showTaggingDropdown && (
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
          disabled={isLoading || !newMessage.trim()}
          className={`p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 disabled:shadow-none min-w-[60px] backdrop-blur-sm border border-blue-500/30 disabled:border-gray-600/50`}
          title="Send message"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <IoSend size={20} />
          )}
        </button>
      </div>
    </form>
  );
}