// ReactionPicker.js
"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from '@/context/ThemeContext';
import { 
  FaPartyHorn,
  FaHandsClapping,
  FaTimes,
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry
} from "react-icons/fa";
import { HandCoins, PartyPopper } from "lucide-react";

const REACTIONS = [
  { emoji: "👍", icon: FaThumbsUp, label: "Like", color: "text-blue-400" },
  { emoji: "❤️", icon: FaHeart, label: "Love", color: "text-red-400" },
  { emoji: "😂", icon: FaLaugh, label: "Laugh", color: "text-yellow-400" },
  { emoji: "😮", icon: FaSurprise, label: "Wow", color: "text-yellow-500" },
  { emoji: "😢", icon: FaSadTear, label: "Sad", color: "text-blue-300" },
  { emoji: "😡", icon: FaAngry, label: "Angry", color: "text-red-500" },
  { emoji: "🎉", icon: PartyPopper, label: "Celebrate", color: "text-purple-400" },
  { emoji: "👏", icon: HandCoins, label: "Clap", color: "text-green-400" }
];

export default function ReactionPicker({ position, onSelectReaction, onClose, currentReaction }) {
  const { theme } = useTheme();
  const pickerRef = useRef(null);
  const [selectedReaction, setSelectedReaction] = useState(currentReaction);
  const [hoveredReaction, setHoveredReaction] = useState(null);

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    border: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    shadow: theme === 'dark' ? 'shadow-2xl' : 'shadow-xl',
    button: {
      hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      remove: theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-red-500/20' : 'text-gray-500 hover:text-red-600 hover:bg-red-500/10'
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Auto-close after selection
  useEffect(() => {
    if (selectedReaction && selectedReaction !== currentReaction) {
      const timer = setTimeout(() => {
        onSelectReaction(selectedReaction);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedReaction, currentReaction, onSelectReaction]);

  const handleReactionHover = (reaction) => {
    setHoveredReaction(reaction);
  };

  const handleReactionClick = (reaction) => {
    setSelectedReaction(reaction);
    // Immediate selection on click
    onSelectReaction(reaction);
  };

  const handleReactionLeave = () => {
    setHoveredReaction(null);
  };

  const getReactionConfig = (reactionEmoji) => {
    return REACTIONS.find(r => r.emoji === reactionEmoji) || REACTIONS[0];
  };

  return (
    <div
      ref={pickerRef}
      className={`fixed ${themeStyles.background} border ${themeStyles.border} rounded-2xl ${themeStyles.shadow} p-3 flex gap-2 z-50 transform -translate-x-1/2 -translate-y-full reaction-picker backdrop-blur-sm`}
      style={{
        left: position.x,
        top: position.y - 10,
      }}
    >
      {REACTIONS.map((reaction) => {
        const isSelected = selectedReaction === reaction.emoji;
        const isHovered = hoveredReaction === reaction.emoji;
        const IconComponent = reaction.icon;
        
        return (
          <button
            key={reaction.emoji}
            onMouseEnter={() => handleReactionHover(reaction.emoji)}
            onMouseLeave={handleReactionLeave}
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`group relative w-10 h-10 flex items-center justify-center transition-all duration-200 rounded-full ${
              isSelected 
                ? 'bg-yellow-500/20 scale-125 border border-yellow-500/30' 
                : `${themeStyles.button.hover} hover:scale-110 border border-transparent`
            }`}
            title={reaction.label}
          >
            {/* Icon with smooth transition */}
            <div className={`transition-all duration-200 ${
              isSelected ? 'scale-110' : isHovered ? 'scale-105' : ''
            }`}>
              <IconComponent 
                className={`text-lg ${isSelected ? 'text-yellow-400' : reaction.color} ${
                  isHovered ? 'scale-110' : ''
                } transition-colors duration-200`} 
              />
            </div>

            {/* Tooltip on hover */}
            {isHovered && (
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
              } text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                {reaction.label}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
                } rotate-45`} />
              </div>
            )}

            {/* Pulse animation for selected reaction */}
            {isSelected && (
              <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping opacity-75" />
            )}
          </button>
        );
      })}
      
      {/* Remove reaction option if user already reacted */}
      {currentReaction && (
        <button
          onClick={() => onSelectReaction(null)} // null means remove reaction
          onMouseEnter={() => handleReactionHover('remove')}
          onMouseLeave={handleReactionLeave}
          className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${themeStyles.button.remove}`}
          title="Remove reaction"
        >
          <FaTimes className="text-lg" />
          
          {/* Tooltip on hover */}
          {hoveredReaction === 'remove' && (
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
            } text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
              Remove
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
              } rotate-45`} />
            </div>
          )}
        </button>
      )}

      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-2xl ${
        theme === 'dark' ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-br from-blue-500/3 to-purple-500/3'
      } -z-10 blur-sm`} />
    </div>
  );
}