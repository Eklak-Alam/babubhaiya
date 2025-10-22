export const STYLES = {
  // Background styles
  bg: {
    main: (theme) => theme === 'dark' 
      ? `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`
      : `bg-gradient-to-br from-gray-50 via-white to-gray-100`,
    section: (theme) => theme === 'dark' 
      ? `bg-gray-800/60 backdrop-blur-xl`
      : `bg-white/80 backdrop-blur-xl`,
    card: (theme) => theme === 'dark' 
      ? `bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50`
      : `bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200/50`,
    overlay: (theme) => theme === 'dark' 
      ? `bg-gray-900/80 backdrop-blur-sm`
      : `bg-white/90 backdrop-blur-sm`,
  },
  
  // Text styles
  text: {
    primary: (theme) => theme === 'dark' 
      ? `text-white font-medium`
      : `text-gray-900 font-medium`,
    secondary: (theme) => theme === 'dark' 
      ? `text-gray-300`
      : `text-gray-600`,
    muted: (theme) => theme === 'dark' 
      ? `text-gray-400`
      : `text-gray-500`,
    accent: (theme) => theme === 'dark' 
      ? `text-blue-400 font-semibold`
      : `text-blue-600 font-semibold`,
    success: (theme) => theme === 'dark' 
      ? `text-green-400`
      : `text-green-600`,
    danger: (theme) => theme === 'dark' 
      ? `text-red-400`
      : `text-red-600`,
    warning: (theme) => theme === 'dark' 
      ? `text-yellow-400`
      : `text-yellow-600`,
  },
  
  // Border styles
  border: {
    light: (theme) => theme === 'dark' 
      ? `border border-gray-700/30`
      : `border border-gray-300/30`,
    medium: (theme) => theme === 'dark' 
      ? `border border-gray-600/50`
      : `border border-gray-400/50`,
    strong: (theme) => theme === 'dark' 
      ? `border border-gray-500/70`
      : `border border-gray-500/70`,
    accent: (theme) => theme === 'dark' 
      ? `border border-blue-500/30`
      : `border border-blue-500/30`,
  },
  
  // Button styles
  button: {
    primary: (theme) => theme === 'dark' 
      ? `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 border border-blue-500/30`
      : `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 border border-blue-500/30`,
    secondary: (theme) => theme === 'dark' 
      ? `bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300 border border-gray-600/50`
      : `bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 rounded-xl transition-all duration-300 border border-gray-300/50`,
    danger: (theme) => theme === 'dark' 
      ? `bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 border border-red-500/30`
      : `bg-red-500/15 hover:bg-red-500/25 text-red-600 rounded-xl transition-all duration-300 border border-red-500/30`,
    success: (theme) => theme === 'dark' 
      ? `bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all duration-300 border border-green-500/30`
      : `bg-green-500/15 hover:bg-green-500/25 text-green-600 rounded-xl transition-all duration-300 border border-green-500/30`,
    ghost: (theme) => theme === 'dark' 
      ? `bg-transparent hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-600/50`
      : `bg-transparent hover:bg-gray-200/80 text-gray-500 hover:text-gray-700 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-300/50`,
  },
  
  // Input styles
  input: {
    primary: (theme) => theme === 'dark' 
      ? `bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl transition-all duration-200`
      : `bg-white/80 border border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl transition-all duration-200`,
    search: (theme) => theme === 'dark' 
      ? `bg-gray-800/40 border border-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl transition-all duration-200`
      : `bg-gray-100/80 border border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl transition-all duration-200`,
  },
  
  // Status styles
  status: {
    online: `bg-green-500 border-2 border-green-400`,
    offline: `bg-gray-500 border-2 border-gray-400`,
    away: `bg-yellow-500 border-2 border-yellow-400`,
    busy: `bg-red-500 border-2 border-red-400`,
  },
  
  // Animation styles
  animation: {
    fadeIn: `animate-in fade-in duration-300`,
    slideUp: `animate-in slide-in-from-bottom duration-300`,
    slideDown: `animate-in slide-in-from-top duration-300`,
    slideLeft: `animate-in slide-in-from-left duration-300`,
    slideRight: `animate-in slide-in-from-right duration-300`,
    scale: `animate-in zoom-in duration-300`,
  },
  
  // Shadow styles
  shadow: {
    sm: (theme) => theme === 'dark' 
      ? `shadow-lg shadow-black/20`
      : `shadow-lg shadow-gray-400/20`,
    md: (theme) => theme === 'dark' 
      ? `shadow-xl shadow-black/30`
      : `shadow-xl shadow-gray-400/30`,
    lg: (theme) => theme === 'dark' 
      ? `shadow-2xl shadow-black/40`
      : `shadow-2xl shadow-gray-400/40`,
  },
  
  // Gradient styles
  gradient: {
    primary: `bg-gradient-to-r from-blue-500 to-purple-600`,
    secondary: `bg-gradient-to-r from-gray-600 to-gray-700`,
    success: `bg-gradient-to-r from-green-500 to-emerald-600`,
    danger: `bg-gradient-to-r from-red-500 to-pink-600`,
    warning: `bg-gradient-to-r from-yellow-500 to-orange-600`,
    premium: `bg-gradient-to-r from-purple-500 to-pink-600`,
  }
};

// Helper function to use STYLES with theme
export const getStyle = (stylePath, theme = 'dark') => {
  const style = STYLES;
  const path = stylePath.split('.');
  
  let result = style;
  for (const key of path) {
    result = result[key];
    if (typeof result === 'function') {
      return result(theme);
    }
  }
  
  return typeof result === 'function' ? result(theme) : result;
};

// Usage example:
// getStyle('bg.card', theme)
// getStyle('button.primary', theme)
// getStyle('text.accent', theme)

export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Additional formatting utilities
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(timestamp);
};

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
  if (isToday) return formatTime(timestamp);
  if (isYesterday) return `Yesterday ${formatTime(timestamp)}`;
  
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};