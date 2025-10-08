import { forwardRef } from "react";
import MessageItem from "./MessageItem";
import { FaUserFriends, FaRobot } from "react-icons/fa";
import { STYLES } from "./styles";

const MessageList = forwardRef(function MessageList({
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
}, ref) {
  if (messages.length === 0) {
    return (
      <div
        ref={ref}
        className="flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10"
      >
        <div
          className={`flex flex-col items-center justify-center h-full text-gray-500`}
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-blue-500/30">
            <FaUserFriends className="text-3xl text-gray-400/50" />
          </div>
          <p className={`text-lg font-medium text-white opacity-70`}>
            No messages yet
          </p>
          <p className={`text-sm text-gray-500 mt-1`}>
            Start the conversation by sending a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10"
    >
      <div className="space-y-3 pb-4">
        {messages.map((msg, index) => (
          <MessageItem
            key={msg.id || index}
            message={msg}
            index={index}
            messages={messages}
            user={user}
            selectedUser={selectedUser}
            isGroup={isGroup}
            editingMessage={editingMessage}
            editMessageContent={editMessageContent}
            onEditMessage={onEditMessage}
            onEditMessageContent={onEditMessageContent}
            onSaveEdit={onSaveEdit}
            onOpenMessageActions={onOpenMessageActions}
          />
        ))}
      </div>
    </div>
  );
});

export default MessageList;