import { forwardRef } from "react";
import MessageItem from "./MessageItem";
import AILoadingIndicator from "./AILoadingIndicator";
import { FaUserFriends } from "react-icons/fa";
import { useTheme } from '@/context/ThemeContext';

const MessageList = forwardRef(function MessageList(
  {
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
    isAIResponding = false, // Single prop to control AI loading
  },
  ref
) {
  const { theme } = useTheme();

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    },
    emptyState: {
      icon: theme === 'dark' 
        ? 'bg-blue-500/20 ring-blue-500/30 text-gray-400/50' 
        : 'bg-blue-500/15 ring-blue-500/20 text-gray-500/60',
      text: {
        primary: theme === 'dark' ? 'text-white opacity-70' : 'text-gray-700 opacity-80',
        secondary: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
      }
    }
  };

  if (messages.length === 0) {
    return (
      <div
        ref={ref}
        className={`flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10 ${themeStyles.background}`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full ${themeStyles.text.secondary}`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ring-2 ${themeStyles.emptyState.icon}`}>
            <FaUserFriends className="text-3xl" />
          </div>
          <p className={`text-lg font-medium ${themeStyles.emptyState.text.primary}`}>
            No messages yet
          </p>
          <p className={`text-sm ${themeStyles.emptyState.text.secondary} mt-1`}>
            Start the conversation by sending a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10 ${themeStyles.background}`}
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
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            isAIResponding={isAIResponding}
          />
        ))}

        {/* AI Loading Indicator - Only shows when AI is responding */}
        {isAIResponding && <AILoadingIndicator />}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
        }
      `}</style>
    </div>
  );
});

export default MessageList;