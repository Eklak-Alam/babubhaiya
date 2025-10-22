import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function AILoadingIndicator() {
  const { theme } = useTheme();
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  const dots = ".".repeat(stage);
  
  // Theme-based styles
  const containerBg = theme === 'dark' 
    ? 'bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-400/30' 
    : 'bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200';
  
  const avatarBg = theme === 'dark'
    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
    : 'bg-gradient-to-r from-blue-400 to-indigo-500';
  
  const avatarPulse = theme === 'dark'
    ? 'border-blue-400'
    : 'border-blue-300';
  
  const titleColor = theme === 'dark'
    ? 'text-blue-100'
    : 'text-blue-800';
  
  const dotsColor = theme === 'dark'
    ? 'text-blue-300'
    : 'text-blue-600';
  
  const bouncingDotsColor = theme === 'dark'
    ? 'bg-blue-400'
    : 'bg-blue-500';

  return (
    <div className="flex justify-start mt-3">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl rounded-bl-md max-w-xs backdrop-blur-sm shadow-lg transition-all duration-300 ${containerBg}`}>
        {/* AI Avatar with smooth animation */}
        <div className="relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${avatarBg}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm2.07-7.75l-.9.92C11.45 10.9 11 11.5 11 13h2v-.5c0-.46.21-.86.53-1.16l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2h2c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          {/* Subtle pulse effect */}
          <div className={`absolute inset-0 border-2 rounded-full animate-pulse opacity-60 transition-colors duration-300 ${avatarPulse}`}></div>
        </div>
        
        {/* Typing indicator */}
        <div className="flex flex-col min-w-[120px]">
          <div className="flex items-center gap-1">
            <span className={`text-sm font-semibold transition-colors duration-300 ${titleColor}`}>
              AI Assistant
            </span>
            <span className={`text-sm min-w-[60px] transition-colors duration-300 ${dotsColor}`}>
              thinking{dots}
            </span>
          </div>
          
          {/* Optimized bouncing dots */}
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-300 ${bouncingDotsColor}`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}