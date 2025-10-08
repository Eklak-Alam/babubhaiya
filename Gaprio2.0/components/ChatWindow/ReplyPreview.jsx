import { FaReply } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { STYLES } from "./styles";

export default function ReplyPreview({ replyingTo, onCancelReply }) {
  return (
    <div className="px-4 pt-3 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <FaReply size={12} />
            <span>
              Replying to <strong>{replyingTo.sender_name}</strong>
            </span>
          </div>
          <div className="text-sm text-gray-400 truncate">
            {replyingTo.message_content}
          </div>
        </div>
        <button
          onClick={onCancelReply}
          className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <IoClose size={16} />
        </button>
      </div>
    </div>
  );
}