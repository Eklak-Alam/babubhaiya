// TaggingDropdown.js (Simplified)
"use client";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaSearch, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/context/ApiContext";

export default function TaggingDropdown({
  query,
  selectedUser,
  isGroup,
  onSelectUser,
  onSelectAI,
  onSelectEveryone,
  onClose,
  API,
}) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Create safe versions of the callback functions
  const safeOnSelectAI = onSelectAI || (() => console.log("AI selected"));
  const safeOnSelectEveryone = onSelectEveryone || (() => console.log("Everyone selected"));
  const safeOnSelectUser = onSelectUser || (() => console.log("User selected"));

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.trim().length < 1) {
        // Show default suggestions when no query
        const defaultSuggestions = [
          { 
            type: "ai", 
            id: "ai", 
            name: "AI Assistant", 
            username: "ai", 
            description: "Ask AI anything" 
          },
        ];
        
        if (isGroup) {
          defaultSuggestions.push(
            { 
              type: "all", 
              id: "all", 
              name: "Everyone", 
              username: "all", 
              description: "Notify all group members" 
            }
          );
        }
        
        setSuggestions(defaultSuggestions);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const cleanQuery = query.trim();
        
        if (cleanQuery.length < 1) {
          setSuggestions([]);
          return;
        }

        const response = await API.get(`/tags/search-users`, {
          params: { 
            query: cleanQuery,
            ...(isGroup && selectedUser?.id && { groupId: selectedUser.id })
          }
        });
        
        let users = [];
        
        if (response.data?.success) {
          users = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          users = response.data;
        } else if (response.data?.users) {
          users = response.data.users;
        } else {
          users = response.data || [];
        }

        const filteredUsers = (Array.isArray(users) ? users : [])
          .filter(userResult => userResult.id !== user?.id)
          .map(user => ({
            ...user,
            type: "user"
          }));

        setSuggestions(filteredUsers);
        
      } catch (error) {
        console.error("Error fetching tagging suggestions:", error);
        setError("Failed to load suggestions");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeoutId);
  }, [query, isGroup, selectedUser, API, user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!dropdownRef.current) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            suggestions.length > 0 ? (prev + 1) % suggestions.length : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            suggestions.length > 0 ? (prev - 1 + suggestions.length) % suggestions.length : 0
          );
          break;
        case "Enter":
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "Tab":
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex, onClose]);

  const handleSelect = (item) => {
    console.log("Selected item:", item);
    switch (item.type) {
      case "ai":
        safeOnSelectAI();
        break;
      case "all":
        safeOnSelectEveryone();
        break;
      case "user":
        safeOnSelectUser(item);
        break;
      default:
        console.warn("Unknown item type:", item.type);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ai":
        return <FaRobot className="text-purple-400" size={14} />;
      case "all":
        return <FaUsers className="text-green-400" size={14} />;
      default:
        return <FaUser className="text-blue-400" size={14} />;
    }
  };

  const getDisplayName = (item) => {
    if (item.type === "user") {
      return item.name || item.username || `User ${item.id}`;
    }
    return item.name;
  };

  const getDisplayUsername = (item) => {
    if (item.type === "user") {
      return `@${item.username}`;
    }
    return item.description;
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50"
      tabIndex={-1}
    >
      <div className="p-2 border-b border-gray-700">
        <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <FaSearch size={10} />
          Mention someone
        </div>
      </div>

      {isLoading && (
        <div className="p-3 text-gray-400 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Searching for "{query}"...
        </div>
      )}

      {error && !isLoading && (
        <div className="p-3 text-amber-400 text-sm flex items-center gap-2">
          <FaExclamationTriangle size={12} />
          {error}
        </div>
      )}

      {!isLoading && !error && suggestions.length === 0 && query && (
        <div className="p-3 text-gray-400 text-sm">
          No users found for "{query}"
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="py-1">
          {suggestions.map((item, index) => (
            <button
              key={item.id || item.type}
              className={`w-full p-3 text-left hover:bg-gray-700/50 transition-colors flex items-center gap-3 ${
                index === selectedIndex ? 'bg-gray-700/70' : ''
              }`}
              onClick={() => handleSelect(item)}
            >
              <div className="flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate text-sm">
                  {getDisplayName(item)}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {getDisplayUsername(item)}
                </div>
              </div>
              {item.type === "all" && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex-shrink-0">
                  Group
                </span>
              )}
              {item.type === "ai" && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded flex-shrink-0">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!isLoading && !error && suggestions.length === 0 && !query && (
        <div className="py-1">
          <button
            className="w-full p-3 text-left hover:bg-gray-700/50 transition-colors flex items-center gap-3"
            onClick={safeOnSelectAI}
          >
            <FaRobot className="text-purple-400" size={14} />
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm">AI Assistant</div>
              <div className="text-gray-400 text-xs">Ask AI anything</div>
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
              AI
            </span>
          </button>
          {isGroup && (
            <button
              className="w-full p-3 text-left hover:bg-gray-700/50 transition-colors flex items-center gap-3"
              onClick={safeOnSelectEveryone}
            >
              <FaUsers className="text-green-400" size={14} />
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">Everyone</div>
                <div className="text-gray-400 text-xs">Notify all group members</div>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                Group
              </span>
            </button>
          )}
        </div>
      )}

      <div className="p-2 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          ↑↓ to navigate • Enter to select • Esc to close
        </div>
      </div>
    </div>
  );
}