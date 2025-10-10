// ReactionsDisplay.js
"use client";
import { useState } from "react";

export default function ReactionsDisplay({ reactions, onReactionClick, userReaction, onRemoveReaction }) {
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

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.values(reactionGroups).map((group) => (
        <button
          key={group.reaction}
          onClick={(e) => handleReactionClick(e, group.reaction)}
          onMouseEnter={() => setShowTooltip(group.reaction)}
          onMouseLeave={() => setShowTooltip(null)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-200 ${
            userReaction?.reaction === group.reaction
              ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
              : 'bg-gray-700/60 border-gray-600/50 text-gray-300 hover:bg-gray-600/70'
          } relative group`}
        >
          <span className="text-sm">{group.reaction}</span>
          <span className="font-medium min-w-[8px] text-center">{group.count}</span>
          
          {/* Tooltip */}
          {showTooltip === group.reaction && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-50 shadow-xl">
              <div className="font-semibold text-white mb-1">
                {group.reaction} {group.count}
              </div>
              <div className="text-gray-300 max-w-xs">
                {group.users.slice(0, 3).join(', ')}
                {group.users.length > 3 && ` and ${group.users.length - 3} more`}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}