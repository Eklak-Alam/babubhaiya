export const STYLES = {
  bg: {
    main: `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`,
    section: `bg-gray-800/60 backdrop-blur-xl`,
    card: `bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50`,
  },
  text: {
    primary: `text-white font-medium`,
    secondary: `text-gray-300`,
    muted: `text-gray-400`,
    accent: `text-blue-400 font-semibold`,
  },
  border: {
    light: `border border-gray-700/30`,
    medium: `border border-gray-600/50`,
    strong: `border border-gray-500/70`,
  },
  button: {
    primary: `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 border border-blue-500/30`,
    secondary: `bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300 border border-gray-600/50`,
    danger: `bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 border border-red-500/30`,
    success: `bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all duration-300 border border-green-500/30`,
  },
};

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


