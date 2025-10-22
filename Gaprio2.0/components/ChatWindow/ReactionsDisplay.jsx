// ReactionsDisplay.js
"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ReactionsDisplay({ reactions, onReactionClick, userReaction, onRemoveReaction }) {
  const { theme } = useTheme();
  
  // Theme-based styles
  const getStyles = (theme) => ({
    // Reaction button styles
    reactionButton: {
      base: `
        flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-200 relative group
      `,
      active: theme === 'dark' 
        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' 
        : 'bg-yellow-100 border-yellow-300 text-yellow-700',
      inactive: theme === 'dark' 
        ? 'bg-gray-700/60 border-gray-600/50 text-gray-300 hover:bg-gray-600/70' 
        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
    },
    
    // Tooltip styles
    tooltip: {
      container: theme === 'dark' 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-300 shadow-lg',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      users: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      arrow: theme === 'dark' ? 'border-t-gray-900' : 'border-t-white'
    }
  });

  const STYLES = getStyles(theme);

  // Group reactions by type and count users
  const reactionGroups = reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = {
        count: 0,
        users: [],
        reaction: reaction.reaction
      };
    }
    acc[reaction.reaction].count++;
    acc[reaction.reaction].users.push(reaction.user_name || `User ${reaction.user_id}`);
    return acc;
  }, {}) || {};

  const [showTooltip, setShowTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (Object.keys(reactionGroups).length === 0) return null;

  const handleReactionClick = (e, reactionType) => {
    e.stopPropagation();
    
    // If user already has this reaction, remove it
    if (userReaction && userReaction.reaction === reactionType && onRemoveReaction) {
      onRemoveReaction();
    } else {
      onReactionClick(e);
    }
  };

  const handleMouseEnter = (e, reactionType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setShowTooltip(reactionType);
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.values(reactionGroups).map((group) => (
        <button
          key={group.reaction}
          onClick={(e) => handleReactionClick(e, group.reaction)}
          onMouseEnter={(e) => handleMouseEnter(e, group.reaction)}
          onMouseLeave={() => setShowTooltip(null)}
          className={`${STYLES.reactionButton.base} ${
            userReaction?.reaction === group.reaction
              ? STYLES.reactionButton.active
              : STYLES.reactionButton.inactive
          }`}
        >
          <span className="text-sm transition-transform duration-200 group-hover:scale-110">
            {group.reaction}
          </span>
          <span className="font-medium min-w-[8px] text-center transition-colors duration-200">
            {group.count}
          </span>
        </button>
      ))}
      
      {/* Floating Tooltip */}
      {showTooltip && reactionGroups[showTooltip] && (
        <div 
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 8}px`
          }}
        >
          <div className={`rounded-lg px-3 py-2 border text-xs whitespace-nowrap mb-2 transition-all duration-200 ${STYLES.tooltip.container}`}>
            <div className={`font-semibold mb-1 ${STYLES.tooltip.title}`}>
              {reactionGroups[showTooltip].reaction} {reactionGroups[showTooltip].count}
            </div>
            <div className={`max-w-xs ${STYLES.tooltip.users}`}>
              {reactionGroups[showTooltip].users.slice(0, 3).join(', ')}
              {reactionGroups[showTooltip].users.length > 3 && ` and ${reactionGroups[showTooltip].users.length - 3} more`}
            </div>
          </div>
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${STYLES.tooltip.arrow}`}></div>
        </div>
      )}
    </div>
  );
}