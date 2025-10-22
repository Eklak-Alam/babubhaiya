import { FaRobot } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function EmptyState() {
  const { theme } = useTheme();

  // Theme-based styles
  const containerBg = theme === 'dark' 
    ? 'bg-gray-900' 
    : 'bg-white';
  
  const robotBg = theme === 'dark'
    ? 'bg-blue-500/20 ring-blue-500/30'
    : 'bg-blue-100 ring-blue-200';
  
  const robotIcon = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500';
  
  const titleColor = theme === 'dark'
    ? 'text-white'
    : 'text-gray-900';
  
  const descriptionColor = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  return (
    <div
      className={`flex flex-col items-center justify-center flex-grow ${containerBg} relative overflow-hidden transition-colors duration-200`}
    >
      <div className="text-center p-8 relative z-10">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 transition-colors duration-200 ${robotBg}`}>
          <FaRobot className={`text-4xl transition-colors duration-200 ${robotIcon}`} />
        </div>
        <p className={`text-xl font-semibold mb-2 transition-colors duration-200 ${titleColor}`}>
          Welcome to Chat
        </p>
        <p className={`transition-colors duration-200 ${descriptionColor}`}>
          Select a user or group to start chatting
        </p>
      </div>
    </div>
  );
}