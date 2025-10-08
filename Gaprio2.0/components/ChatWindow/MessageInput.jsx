import { FaRegSmileBeam } from "react-icons/fa";
import { STYLES } from "./styles";
import { IoSend } from "react-icons/io5";

export default function MessageInput({
  newMessage,
  isLoading,
  selectedUser,
  isGroup,
  onNewMessageChange,
  onSendMessage,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={onSendMessage}
      className={`p-4 border-t border-gray-700/50 ${STYLES.bg.section} relative z-10`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${
              isGroup ? selectedUser.name : selectedUser.name
            }...`}
            className={`w-full p-4 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 pr-12`}
            disabled={isLoading}
            maxLength={1000}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors rounded-lg"
              title="Emoji"
            >
              <FaRegSmileBeam size={16} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 disabled:shadow-none min-w-[60px] backdrop-blur-sm border border-blue-500/30 disabled:border-gray-600/50`}
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