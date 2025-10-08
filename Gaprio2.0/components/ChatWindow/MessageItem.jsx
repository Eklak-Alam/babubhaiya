import { useRef, useEffect } from "react";
import { FaCrown, FaCheck, FaReply } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { formatTime, formatDate } from "./styles";

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
}) {
  const isOwnMessage = message.sender_id === user.id;
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

  return (
    <div className="message-container">
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
              : `bg-gray-800/50 text-white rounded-bl-md border border-gray-700/50`
          } ${isConsecutive ? "mt-1" : "mt-2"}`}
        >
          {/* Reply Context */}
          {message.reply_to && (
            <div
              className={`text-xs mb-2 p-2 rounded-lg border-l-2 ${
                isOwnMessage
                  ? "border-blue-300 bg-blue-400/20"
                  : "border-gray-500 bg-gray-700/30"
              }`}
            >
              <div className="font-medium truncate">
                <FaReply size={10} className="inline mr-1" />
                Replying to {message.reply_to_sender_name || "a message"}
              </div>
              <div className="truncate text-gray-400">
                {message.reply_to_content}
              </div>
            </div>
          )}

          {showSenderInfo && !isConsecutive && (
            <div
              className={`text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1`}
            >
              {message.sender_name}
              {message.sender_id === selectedUser.owner_id && (
                <FaCrown size={10} className="text-yellow-400" />
              )}
            </div>
          )}

          {isEditingThisMessage ? (
            <div className="space-y-3">
    <textarea
      ref={editTextareaRef}
      data-editing="true" // Add this line
      value={editMessageContent}
      onChange={(e) => onEditMessageContent(e.target.value)}
      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      rows="3"
      placeholder="Edit your message..."
      onKeyDown={handleKeyDown}
    />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    onEditMessage(null);
                    onEditMessageContent("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-sm transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSaveEdit(message.id, editMessageContent)}
                  disabled={!editMessageContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="break-words leading-relaxed text-white/90">
                {message.message_content}
              </div>

              <div
                className={`text-xs mt-2 flex items-center justify-between ${
                  isOwnMessage ? "text-blue-100/70" : "text-gray-400"
                }`}
              >
                <span>{formatTime(message.timestamp)}</span>
                <div className="flex items-center gap-2">
                  {message.edited_at && (
                    <span className="text-gray-400 italic text-xs">
                      (edited)
                    </span>
                  )}
                  {isOwnMessage && (
                    <span className="text-xs opacity-70 flex items-center gap-1">
                      <FaCheck size={10} />
                      <FaCheck size={10} className="-ml-2" />
                    </span>
                  )}
                  {isOwnMessage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMessageActions(message);
                      }}
                      className={`p-1 rounded-lg transition-all duration-200 ${
                        isOwnMessage
                          ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                      }`}
                    >
                      <IoEllipsisVertical size={12} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}