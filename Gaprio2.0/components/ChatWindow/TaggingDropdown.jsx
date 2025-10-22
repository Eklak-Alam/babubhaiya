"use client";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaSearch, FaUsers, FaExclamationTriangle, FaMagic } from "react-icons/fa";
import { useAuth } from "@/context/ApiContext";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Theme-based styles
  const getStyles = (theme) => ({
    // Container
    container: theme === 'dark' 
      ? 'bg-gray-800 border-gray-600' 
      : 'bg-white border-gray-300 shadow-2xl',
    
    // Text colors
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
      accent: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    
    // Borders
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    
    // Buttons and items
    item: {
      base: 'w-full p-3 text-left transition-colors flex items-center gap-3',
      hover: theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100',
      selected: theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-200',
    },
    
    // Quick prompt buttons
    quickPrompt: theme === 'dark' 
      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300' 
      : 'bg-purple-100 hover:bg-purple-200 text-purple-700',
    
    // Badges
    badge: {
      ai: theme === 'dark' 
        ? 'bg-purple-500/20 text-purple-400' 
        : 'bg-purple-100 text-purple-700',
      group: theme === 'dark' 
        ? 'bg-green-500/20 text-green-400' 
        : 'bg-green-100 text-green-700',
    },
    
    // Loading and error states
    loading: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    error: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
  });

  const STYLES = getStyles(theme);

  // AI prompt suggestions for quick access
  const aiQuickPrompts = [
    { id: "summarize", type: "ai_prompt", name: "Summarize conversation", description: "Get a summary of this chat", prompt: "summarize this conversation" },
    { id: "analyze", type: "ai_prompt", name: "Analyze mood", description: "Analyze the emotional tone", prompt: "analyze the mood and tone of this conversation" },
    { id: "suggest", type: "ai_prompt", name: "Suggest next steps", description: "What should we do next?", prompt: "suggest what we should do next" },
    { id: "clarify", type: "ai_prompt", name: "Clarify points", description: "Help clarify main points", prompt: "help clarify the main points discussed" },
  ];

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
      case "ai_prompt":
        safeOnSelectAI(item.prompt);
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
      case "ai_prompt":
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
      className={`absolute bottom-full mb-2 left-0 right-0 border rounded-lg max-h-80 overflow-y-auto z-50 transition-colors duration-200 ${STYLES.container} ${STYLES.border}`}
      tabIndex={-1}
    >
      {/* Header */}
      <div className={`p-3 border-b transition-colors duration-200 ${STYLES.border}`}>
        <div className={`text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${STYLES.text.secondary}`}>
          <FaSearch size={12} />
          Mention someone or ask AI
        </div>
      </div>

      {/* Quick AI Prompts Section */}
      {(!query || query.trim().length === 0) && (
        <div className={`p-3 border-b transition-colors duration-200 ${STYLES.border}`}>
          <div className={`text-sm font-medium flex items-center gap-2 mb-2 transition-colors duration-200 ${STYLES.text.secondary}`}>
            <FaMagic size={12} />
            Quick AI Prompts
          </div>
          <div className="grid grid-cols-2 gap-2">
            {aiQuickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSelect(prompt)}
                className={`text-xs p-2 text-left rounded transition-colors duration-200 truncate ${STYLES.quickPrompt}`}
                title={prompt.description}
              >
                {prompt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`p-3 text-sm flex items-center gap-2 transition-colors duration-200 ${STYLES.loading}`}>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Searching for "{query}"...
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={`p-3 text-sm flex items-center gap-2 transition-colors duration-200 ${STYLES.error}`}>
          <FaExclamationTriangle size={12} />
          {error}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && suggestions.length === 0 && query && (
        <div className={`p-3 text-sm transition-colors duration-200 ${STYLES.text.muted}`}>
          No users found for "{query}"
        </div>
      )}

      {/* Suggestions List */}
      {!isLoading && suggestions.length > 0 && (
        <div className="py-1">
          {suggestions.map((item, index) => (
            <button
              key={item.id || item.type}
              className={`${STYLES.item.base} ${
                index === selectedIndex ? STYLES.item.selected : STYLES.item.hover
              } transition-colors duration-200`}
              onClick={() => handleSelect(item)}
            >
              <div className="flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate text-sm transition-colors duration-200 ${STYLES.text.primary}`}>
                  {getDisplayName(item)}
                </div>
                <div className={`text-xs truncate transition-colors duration-200 ${STYLES.text.secondary}`}>
                  {getDisplayUsername(item)}
                </div>
              </div>
              {item.type === "all" && (
                <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${STYLES.badge.group}`}>
                  Group
                </span>
              )}
              {item.type === "ai" && (
                <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${STYLES.badge.ai}`}>
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Default Suggestions */}
      {!isLoading && !error && suggestions.length === 0 && !query && (
        <div className="py-1">
          <button
            className={`${STYLES.item.base} ${STYLES.item.hover} transition-colors duration-200`}
            onClick={safeOnSelectAI}
          >
            <FaRobot className="text-purple-400" size={14} />
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm transition-colors duration-200 ${STYLES.text.primary}`}>AI Assistant</div>
              <div className={`text-xs transition-colors duration-200 ${STYLES.text.secondary}`}>Ask AI anything - summarize, analyze, help</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${STYLES.badge.ai}`}>
              AI
            </span>
          </button>
          {isGroup && (
            <button
              className={`${STYLES.item.base} ${STYLES.item.hover} transition-colors duration-200`}
              onClick={safeOnSelectEveryone}
            >
              <FaUsers className="text-green-400" size={14} />
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm transition-colors duration-200 ${STYLES.text.primary}`}>Everyone</div>
                <div className={`text-xs transition-colors duration-200 ${STYLES.text.secondary}`}>Notify all group members</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${STYLES.badge.group}`}>
                Group
              </span>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={`p-3 border-t transition-colors duration-200 ${STYLES.border}`}>
        <div className={`text-xs transition-colors duration-200 ${STYLES.text.accent}`}>
          ↑↓ to navigate • Enter to select • Esc to close
        </div>
      </div>
    </div>
  );
}