import { useState, useEffect } from "react";

export default function AILoadingIndicator() {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  const dots = ".".repeat(stage);
  
  return (
    <div className="flex justify-start mt-3">
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-400/30 rounded-2xl rounded-bl-md max-w-xs backdrop-blur-sm shadow-lg">
        {/* AI Avatar with smooth animation */}
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm2.07-7.75l-.9.92C11.45 10.9 11 11.5 11 13h2v-.5c0-.46.21-.86.53-1.16l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2h2c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          {/* Subtle pulse effect */}
          <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-pulse opacity-60"></div>
        </div>
        
        {/* Typing indicator */}
        <div className="flex flex-col min-w-[120px]">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-blue-100">AI Assistant</span>
            <span className="text-sm text-blue-300 min-w-[60px]">
              thinking{dots}
            </span>
          </div>
          
          {/* Optimized bouncing dots */}
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((index) => (
              <div 
                key={index}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
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