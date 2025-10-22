import { FaReply } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useTheme } from '@/context/ThemeContext';

export default function ReplyPreview({ replyingTo, onCancelReply }) {
  const { theme } = useTheme();

  // Theme-based styles
  const themeStyles = {
    container: theme === 'dark' 
      ? 'bg-gray-800/30 border-gray-700/50' 
      : 'bg-gray-100/80 border-gray-300/50',
    preview: theme === 'dark' 
      ? 'bg-gray-700/30 border-gray-600/50' 
      : 'bg-white/80 border-gray-300/50',
    text: {
      primary: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    },
    button: theme === 'dark' 
      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600/30' 
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
  };

  return (
    <div className={`px-4 pt-3 border-t backdrop-blur-sm transition-colors duration-200 ${themeStyles.container}`}>
      <div className={`flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm transition-all duration-200 ${themeStyles.preview}`}>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 text-sm mb-1 ${themeStyles.text.primary}`}>
            <div className={`p-1 rounded-lg ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/15'
            }`}>
              <FaReply size={10} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
            </div>
            <span>
              Replying to <strong className="font-semibold">{replyingTo.sender_name}</strong>
            </span>
          </div>
          <div className={`text-sm truncate pl-4 border-l-2 ${
            theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-400 text-gray-600'
          }`}>
            {replyingTo.message_content}
          </div>
        </div>
        <button
          onClick={onCancelReply}
          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${themeStyles.button}`}
          title="Cancel reply"
        >
          <IoClose size={16} />
        </button>
      </div>

      {/* Subtle animation on mount */}
      <style jsx>{`
        div {
          animation: slideUp 0.2s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}