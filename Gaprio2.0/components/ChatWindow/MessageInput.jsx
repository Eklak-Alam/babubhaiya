"use client";
import { useState, useRef, useEffect } from "react";
import { FaRegSmileBeam, FaAt, FaHashtag, FaTimes } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useTheme } from "@/context/ThemeContext";
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
  const { theme } = useTheme();
  const [showTaggingDropdown, setShowTaggingDropdown] = useState(false);
  const [taggingQuery, setTaggingQuery] = useState("");
  const [taggingPosition, setTaggingPosition] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  // Theme-based styles
  const getStyles = (theme) => ({
    container: `
      p-4 border-t transition-colors duration-200
      ${theme === 'dark' ? 'border-gray-700/50 bg-gray-800' : 'border-gray-300 bg-white'}
    `,
    input: `
      w-full p-4 border rounded-xl focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-200 pr-12
      ${theme === 'dark' 
        ? 'bg-gray-700/30 text-white placeholder-gray-400 border-gray-600/50 focus:ring-blue-500/50' 
        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-blue-500/50'
      }
    `,
    inputDisabled: `
      ${theme === 'dark' 
        ? 'border-red-500/50 focus:ring-red-500/50 cursor-not-allowed' 
        : 'border-red-400/50 focus:ring-red-400/50 cursor-not-allowed'
      }
    `,
    replyPreview: `
      mb-3 p-3 rounded-lg flex items-center justify-between border transition-colors duration-200
      ${theme === 'dark' 
        ? 'bg-blue-500/10 border-blue-500/20' 
        : 'bg-blue-100 border-blue-200'
      }
    `,
    replyText: {
      header: `text-xs font-medium mb-1 transition-colors duration-200 ${
        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
      }`,
      content: `text-sm truncate transition-colors duration-200 ${
        theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
      }`
    },
    button: {
      tag: `
        p-1.5 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
        ${theme === 'dark' 
          ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20' 
          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'
        }
      `,
      emoji: `
        p-1.5 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
        ${theme === 'dark' 
          ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20' 
          : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-100'
        }
      `,
      send: `
        p-4 text-white bg-gradient-to-r rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg min-w-[60px] backdrop-blur-sm border
      `,
      sendConnected: `
        from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500/30 hover:shadow-blue-500/25
      `,
      sendDisabled: `
        from-gray-600 to-gray-700 border-gray-600/50 cursor-not-allowed
        ${theme === 'dark' ? 'border-gray-600/50' : 'border-gray-400/50'}
      `,
      sendError: `
        from-red-600 to-red-700 border-red-500/30 cursor-not-allowed
        ${theme === 'dark' ? 'border-red-500/30' : 'border-red-400/30'}
      `
    },
    closeButton: `
      p-1 transition-colors disabled:opacity-50
      ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}
    `
  });

  const STYLES = getStyles(theme);

  // FIX: Focus input after sending message and when selectedUser changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]); // Focus when chat changes

  // Focus input when replying to a message
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // FIXED: Enhanced send handler with proper event prevention and auto-focus
  const handleSendMessageProtected = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isSending || isLoading || !newMessage.trim() || !selectedUser) {
      return;
    }

    setIsSending(true);
    
    try {
      await onSendMessage(e);
      // FIX: Clear message but keep focus after sending
      if (inputRef.current) {
        // Small timeout to ensure message is sent before refocusing
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setTimeout(() => setIsSending(false), 500);
    }
  };

  // FIXED: Enhanced key press handler
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!showTaggingDropdown) {
        handleSendMessageProtected(e);
      }
    } else if (e.key === "@" && !showTaggingDropdown) {
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
      
      // FIX: Focus input after selecting user
      setTimeout(() => {
        inputRef.current.focus();
        // Position cursor after the mention
        const cursorPosition = beforeTag.length + selectedUser.username.length + 2;
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  const handleSelectAI = (prompt = "") => {
    if (inputRef.current) {
      const beforeTag = newMessage.slice(0, taggingPosition);
      const afterTag = newMessage.slice(taggingPosition + 1 + taggingQuery.length);
      
      const aiText = prompt ? `@ai ${prompt}` : "@ai ";
      const newMessageText = `${beforeTag}${aiText}${afterTag}`;
      
      onNewMessageChange(newMessageText);
      setShowTaggingDropdown(false);
      setTaggingQuery("");
      
      // FIX: Focus input after selecting AI
      setTimeout(() => {
        inputRef.current.focus();
        if (prompt) {
          const cursorPosition = newMessageText.length;
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
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
      
      // FIX: Focus input after selecting everyone
      setTimeout(() => {
        inputRef.current.focus();
        const cursorPosition = beforeTag.length + 5; // Position after "@all "
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  const handleManualTagging = (e) => {
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
      className={STYLES.container}
    >
      {/* Reply Preview */}
      {replyingTo && (
        <div className={STYLES.replyPreview}>
          <div className="flex-1">
            <div className={STYLES.replyText.header}>
              Replying to {replyingTo.sender_name || "message"}
            </div>
            <div className={STYLES.replyText.content}>
              {replyingTo.message_content}
            </div>
          </div>
          <button
            type="button"
            onClick={onReplyCancel}
            className={STYLES.closeButton}
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
            className={`${STYLES.input} ${
              !isConnected ? STYLES.inputDisabled : ''
            }`}
            disabled={isDisabled}
            maxLength={1000}
            autoFocus // FIX: Auto-focus the input
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualTagging}
              className={STYLES.button.tag}
              title="Mention someone (@)"
              disabled={isDisabled}
            >
              <FaAt size={16} />
            </button>
            <button
              type="button"
              className={STYLES.button.emoji}
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
              theme={theme}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled || !newMessage.trim()}
          className={`${STYLES.button.send} ${
            !isConnected
              ? STYLES.button.sendError
              : isDisabled || !newMessage.trim()
              ? STYLES.button.sendDisabled
              : STYLES.button.sendConnected
          }`}
          title={!isConnected ? "Not connected to server" : "Send message"}
        >
          {isSending || isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : !isConnected ? (
            <div className={`w-5 h-5 rounded-full animate-pulse ${
              theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
            }`}></div>
          ) : (
            <IoSend size={20} />
          )}
        </button>
      </div>
    </form>
  );
}