import { FaRobot } from "react-icons/fa";
import { STYLES } from "./styles";

export default function EmptyState() {
  return (
    <div
      className={`flex flex-col items-center justify-center flex-grow ${STYLES.bg.main} relative overflow-hidden`}
    >
      <div className="text-center p-8 relative z-10">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-blue-500/30">
          <FaRobot className="text-4xl text-gray-400" />
        </div>
        <p className="text-xl font-semibold text-white mb-2">
          Welcome to Chat
        </p>
        <p className="text-gray-400">
          Select a user or group to start chatting
        </p>
      </div>
    </div>
  );
}