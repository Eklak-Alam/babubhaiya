// ReactionPicker.js
"use client";
import { useEffect, useRef, useState } from "react";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "👏"];

export default function ReactionPicker({ position, onSelectReaction, onClose, currentReaction }) {
  const pickerRef = useRef(null);
  const [selectedReaction, setSelectedReaction] = useState(currentReaction);

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
    setSelectedReaction(reaction);
  };

  const handleReactionClick = (reaction) => {
    setSelectedReaction(reaction);
    // Immediate selection on click
    onSelectReaction(reaction);
  };

  return (
    <div
      ref={pickerRef}
      className="fixed bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl p-3 flex gap-2 z-50 transform -translate-x-1/2 -translate-y-full reaction-picker"
      style={{
        left: position.x,
        top: position.y - 10,
      }}
    >
      {REACTIONS.map((reaction) => (
        <button
          key={reaction}
          onMouseEnter={() => handleReactionHover(reaction)}
          onClick={() => handleReactionClick(reaction)}
          className={`w-10 h-10 flex items-center justify-center text-xl transition-all duration-200 rounded-full ${
            selectedReaction === reaction 
              ? 'bg-yellow-500/20 scale-125 border border-yellow-500/30' 
              : 'hover:bg-gray-700 hover:scale-110'
          }`}
          title={`React with ${reaction}`}
        >
          <span className={`transition-transform duration-200 ${
            selectedReaction === reaction ? 'scale-110' : ''
          }`}>
            {reaction}
          </span>
        </button>
      ))}
      
      {/* Remove reaction option if user already reacted */}
      {currentReaction && (
        <button
          onClick={() => onSelectReaction(null)} // null means remove reaction
          className="w-10 h-10 flex items-center justify-center text-xl text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full transition-all duration-200"
          title="Remove reaction"
        >
          ×
        </button>
      )}
    </div>
  );
}