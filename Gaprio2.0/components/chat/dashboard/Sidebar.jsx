"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/ApiContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {
  FaSignOutAlt,
  FaSearch,
  FaUsers,
  FaTrash,
  FaEllipsisV,
  FaUserPlus,
  FaCrown,
  FaComments,
  FaUserFriends,
  FaTimes,
  FaUserMinus,
  FaExclamationTriangle,
  FaPlus,
  FaRobot,
} from "react-icons/fa";
import CreateGroupModal from "./CreateGroupModal";
import ProfileModal from "@/components/ChatWindow/ProfileModal";

// ================================
// COLOR PALETTE CONSTANTS
// ================================
const COLORS = {
  primary: {
    500: "rgb(59, 130, 246)",
    600: "rgb(37, 99, 235)",
    700: "rgb(29, 78, 216)",
  },
  status: {
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
    errorHover: "bg-red-500/20",
  },
};

// ================================
// STYLE CLASSES CONSTANTS
// ================================
const STYLES = {
  sidebar: `flex flex-col w-full max-w-xs h-full bg-gray-900 border-r border-gray-700 shadow-2xl relative overflow-hidden`,
  header: `p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm`,
  sectionHeader: `px-3 py-2 text-xs font-semibold text-white/80 uppercase tracking-wide`,

  button: {
    primary: `w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/40 transition-all duration-300 font-semibold group relative overflow-hidden`,
    secondary: `px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-blue-500/40`,
    danger: `flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-200 rounded-lg`,
    icon: `p-2 text-gray-400 hover:text-blue-300 transition-all duration-200 rounded-lg hover:bg-blue-500/10 backdrop-blur-sm`,
  },

  input: `w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`,

  listItem: (isActive) =>
    `group relative flex items-center justify-between p-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 border mb-2 ${
      isActive
        ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
        : "border-transparent hover:bg-blue-500/20 hover:border-blue-500/30"
    }`,
  avatar: (colorClass) =>
    `flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colorClass} rounded-full shadow-md ring-1 ring-blue-500/30 transition-shadow duration-200`,

  tab: {
    active: `flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-white bg-blue-500/20 border-b-2 border-blue-500`,
    inactive: `flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-300 hover:bg-blue-500/10`,
  },

  menu: `absolute right-0 top-8 z-50 w-48 py-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-600 backdrop-blur-sm transform origin-top-right`,

  emptyState: {
    container:
      "flex flex-col items-center justify-center py-12 px-4 text-center",
    icon: "w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-blue-500/30",
    title: "font-semibold text-white mb-2",
    description: "text-sm text-gray-400 mb-4",
  },
};

export default function Sidebar({ onSelectUser, onGroupDelete, selectedUser }) {
  const { user, logout, API } = useAuth();
    const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ add this
  const [conversations, setConversations] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const searchTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false)




// Toast configuration first
const showToast = useCallback((message, type = "success") => {
  const toastOptions = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    case "info":
      toast.info(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
}, []);

// Now you can safely use showToast here
const handleLogout = useCallback(async () => {
  try {
    await logout();
    router.push('/chat/login');
  } catch (error) {
    console.error('Logout failed:', error);
    showToast('Logout failed. Please try again.', 'error');
  }
}, [logout, router, showToast]);




  const isGroup = selectedUser?.type === "group";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch conversations and groups when component mounts or when new messages are sent
  useEffect(() => {
    if (user) {
      fetchConversationsAndGroups();

      // Set up interval to refresh conversations periodically
      const interval = setInterval(() => {
        fetchConversationsAndGroups();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchConversationsAndGroups = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch conversations and groups in parallel
      const [conversationsRes, groupsRes] = await Promise.all([
        API.get("/messages/conversations"),
        API.get("/groups"),
      ]);

      // Handle conversations response - ensure it's always an array
      let conversationsData = [];
      if (Array.isArray(conversationsRes.data)) {
        conversationsData = conversationsRes.data;
      } else if (conversationsRes.data?.conversations) {
        conversationsData = conversationsRes.data.conversations;
      } else if (conversationsRes.data?.data) {
        conversationsData = conversationsRes.data.data;
      }

      setConversations(conversationsData);

      // Handle groups response - ensure it's always an array
      let groupsData = [];
      if (Array.isArray(groupsRes.data)) {
        groupsData = groupsRes.data;
      } else if (groupsRes.data?.groups) {
        groupsData = groupsRes.data.groups;
      } else if (groupsRes.data?.data) {
        groupsData = groupsRes.data.data;
      }

      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setConversations([]);
      setGroups([]);
      showToast("Failed to load conversations and groups", "error");
    } finally {
      setLoading(false);
    }
  }, [API, showToast]);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await API.get(
          `/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        console.log("Search results:", response.data);

        // Ensure search results is always an array
        const searchData = Array.isArray(response.data) ? response.data : [];
        setSearchResults(searchData);

        if (searchData.length === 0) {
          showToast("No users found", "info");
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        showToast("Search failed. Please try again.", "error");
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, API, showToast]
  );

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (query.trim()) {
          handleSearch({ preventDefault: () => {} });
        } else {
          setSearchResults([]);
        }
      }, 300);
    },
    [handleSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  const startChat = useCallback(
    (selectedUserOrGroup) => {
      onSelectUser(selectedUserOrGroup);
      setSearchResults([]);
      setSearchQuery("");
      setActiveMenu(null);
      showToast(`Chat started with ${selectedUserOrGroup.name}`, "success");
    },
    [onSelectUser, showToast]
  );

  const handleGroupCreated = useCallback(
    (newGroup) => {
      setGroups((prev) => [newGroup, ...prev]);
      setShowGroupModal(false);
      setActiveTab("groups");
      showToast(`Group "${newGroup.name}" created successfully!`, "success");

      // Refresh groups list to ensure we have the latest data
      setTimeout(() => {
        fetchConversationsAndGroups();
      }, 500);
    },
    [fetchConversationsAndGroups, showToast]
  );

const handleClearConversation = useCallback(
    async (otherUserId, otherUserName, e) => {
        e.stopPropagation();

        if (
            !confirm(
                `Are you sure you want to clear your conversation with ${otherUserName}? This action cannot be undone.`
            )
        ) {
            return;
        }

        try {
            const response = await API.delete(
                `/messages/conversation/${otherUserId}`
            );

            console.log("Clear conversation response:", response.data);

            if (response.data?.success) {
                // Remove from conversations list immediately
                setConversations((prev) =>
                    prev.filter((conv) => conv.id !== otherUserId)
                );

                // If this conversation is currently selected, clear it
                if (selectedUser?.id === otherUserId) {
                    onSelectUser(null);
                    setMessages([]);
                }

                showToast(
                    `Conversation with ${otherUserName} cleared successfully`,
                    "success"
                );
                console.log(
                    `✅ Conversation with ${otherUserName} cleared successfully`
                );
                
                // Refresh conversations to ensure UI is updated
                setTimeout(() => {
                    fetchConversationsAndGroups();
                }, 100);
            } else {
                showToast(
                    response.data?.message || "Failed to clear conversation.",
                    "error"
                );
            }
        } catch (error) {
            console.error("❌ Error clearing conversation:", error);
            console.error("Error details:", error.response?.data);
            
            let errorMessage = "Failed to clear conversation. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showToast(errorMessage, "error");
        } finally {
            setActiveMenu(null);
        }
    },
    [API, selectedUser, onSelectUser, showToast, fetchConversationsAndGroups]
);

  const toggleMenu = useCallback(
    (menuId, e) => {
      e.stopPropagation();
      e.preventDefault();
      setActiveMenu(activeMenu === menuId ? null : menuId);
    },
    [activeMenu]
  );

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Leave Group function
  const leaveGroup = useCallback(
    async (groupId, groupName, e) => {
      e.stopPropagation();

      if (!confirm(`Are you sure you want to leave "${groupName}"?`)) {
        return;
      }

      try {
        const response = await API.delete(
          `/groups/${groupId}/members/${user.id}`
        );

        if (response.data?.success || response.status === 200) {
          setGroups((prev) => prev.filter((group) => group.id !== groupId));

          if (selectedUser?.id === groupId) {
            onSelectUser(null);
          }

          showToast(`You have left "${groupName}"`, "success");
          console.log(`✅ Successfully left group "${groupName}"`);
        } else {
          showToast(
            response.data?.message || "Failed to leave group.",
            "error"
          );
        }
      } catch (error) {
        console.error("❌ Error leaving group:", error);

        if (error.response?.data?.message) {
          if (
            error.response.data.message.includes("Group owner cannot leave")
          ) {
            showToast(
              'As the group owner, you cannot leave the group. Please use the "Delete Group" option instead.',
              "warning"
            );
          } else {
            showToast(error.response.data.message, "error");
          }
        } else {
          showToast("Failed to leave group. Please try again.", "error");
        }
      } finally {
        setActiveMenu(null);
      }
    },
    [API, user, selectedUser, onSelectUser, showToast]
  );

  // Delete Group function for group owners
  const deleteGroup = useCallback(
    async (groupId, groupName, e) => {
      e.stopPropagation();

      if (
        !confirm(
          `⚠️ ARE YOU SURE?\n\nThis will permanently delete "${groupName}" and all its messages. This action cannot be undone!`
        )
      ) {
        return;
      }

      try {
        const response = await API.delete(`/groups/${groupId}`);

        if (response.data?.success || response.status === 200) {
          setGroups((prev) => prev.filter((group) => group.id !== groupId));

          if (onGroupDelete) {
            onGroupDelete(groupId);
          }

          if (selectedUser?.id === groupId) {
            onSelectUser(null);
          }

          showToast(`Group "${groupName}" deleted successfully`, "success");
          console.log(`✅ Group "${groupName}" deleted successfully`);
        } else {
          showToast("Failed to delete group. Please try again.", "error");
        }
      } catch (error) {
        console.error("❌ Error deleting group:", error);

        if (error.response?.data?.message) {
          showToast(error.response.data.message, "error");
        } else {
          showToast("Failed to delete group. Please try again.", "error");
        }
      } finally {
        setActiveMenu(null);
      }
    },
    [API, onGroupDelete, selectedUser, onSelectUser, showToast]
  );

  const fetchGroupMembers = useCallback(
    async (groupId) => {
      if (!groupId) return;

      try {
        const response = await API.get(`/groups/${groupId}/members`);
        console.log("Group members response:", response.data);

        if (response.data?.success) {
          const members =
            response.data.data?.members || response.data.members || [];
          setGroupMembers(Array.isArray(members) ? members : []);
        } else {
          const members = response.data?.members || response.data || [];
          setGroupMembers(Array.isArray(members) ? members : []);
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
        setGroupMembers([]);
        showToast("Failed to load group members", "error");
      }
    },
    [API, showToast]
  );

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (str) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-teal-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-purple-500",
    ];
    const index = str ? str.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getLastMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes === 0 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  // ✅ Your existing function + animation
  const refreshConversations = () => {
    if (isRefreshing) return; // prevent spamming

    setIsRefreshing(true);
    fetchConversationsAndGroups();
    showToast("Refreshing conversations...", "info");

    // Stop spinning after 1 second
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!user) {
    return (
      <div className={STYLES.sidebar}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={STYLES.sidebar}>
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          zIndex: 9999,
        }}
      />

   <div className={STYLES.header}>
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-3 cursor-pointer group flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getRandomColor(
                user.name
              )} rounded-full shadow-lg ring-2 ring-blue-500/30 transition-all duration-300 group-hover:ring-blue-500/50 group-hover:shadow-xl`}
            >
              <span className="font-bold text-white text-lg">
                {getInitials(user.name)}
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate text-lg group-hover:text-blue-300 transition-colors duration-200">
                {user.name}
              </h3>
              <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-200">
                @{user.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshConversations}
              className={`p-2 rounded-full transition-all duration-300
              bg-white/5 hover:bg-gradient-to-br hover:from-green-400/20 hover:to-blue-400/20
              hover:scale-110 hover:shadow-lg`}
              title="Refresh"
            >
              <FiRefreshCw
                className={`text-green-400 drop-shadow-md ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                size={16}
              />
            </button>

            <button
              onClick={handleLogout}
              className={STYLES.button.icon}
              title="Logout"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal - Add this at the bottom */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />


      {/* Create Group Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={() => setShowGroupModal(true)}
          className={STYLES.button.primary}
        >
          <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FaUsers className="flex-shrink-0" />
          <span>Create Group</span>
          <FaPlus
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
            size={12}
          />  
        </button>
      </div>

      {/* Search Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={STYLES.input}
            maxLength={50}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
            >
              <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      {!searchQuery && (
        <div className="flex border-b border-gray-700 bg-gray-800/30">
          <button
            onClick={() => setActiveTab("chats")}
            className={
              activeTab === "chats" ? STYLES.tab.active : STYLES.tab.inactive
            }
          >
            <FaComments size={14} />
            Chats {conversations.length > 0 && `(${conversations.length})`}
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={
              activeTab === "groups" ? STYLES.tab.active : STYLES.tab.inactive
            }
          >
            <FaUsers size={14} />
            Groups {groups.length > 0 && `(${groups.length})`}
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {searchQuery && searchResults.length > 0 ? (
          <div>
            <h4 className={STYLES.sectionHeader}>
              Search Results ({searchResults.length})
            </h4>
            {searchResults.map((foundUser) => (
              <div
                key={foundUser.id}
                onClick={() => startChat({ ...foundUser, type: "user" })}
                className={STYLES.listItem(false)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={STYLES.avatar(getRandomColor(foundUser.name))}
                  >
                    <span className="font-semibold text-white text-sm">
                      {getInitials(foundUser.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {foundUser.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      @{foundUser.username}
                    </div>
                  </div>
                </div>
                <FaUserPlus
                  className="text-green-400 ml-2 flex-shrink-0"
                  size={14}
                />
              </div>
            ))}
          </div>
        ) : searchQuery && isSearching ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm text-gray-400">Searching users...</p>
          </div>
        ) : searchQuery ? (
          <div className={STYLES.emptyState.container}>
            <FaSearch className="text-gray-500 text-3xl mb-3" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Groups Section */}
            {activeTab === "groups" && (
              <div>
                {groups.length > 0 ? (
                  <>
                    <h4 className={STYLES.sectionHeader}>
                      Your Groups ({groups.length})
                    </h4>
                    {groups.map((group) => {
                      const isOwner = group.owner_id === user.id;
                      const isActive =
                        selectedUser?.id === group.id &&
                        selectedUser?.type === "group";

                      return (
                        <div
                          key={group.id}
                          className={STYLES.listItem(isActive)}
                          onClick={() => {
                            startChat({ ...group, type: "group" });
                            fetchGroupMembers(group.id);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={STYLES.avatar(
                                "from-blue-500 to-blue-600"
                              )}
                            >
                              <FaUsers className="text-white text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white truncate flex items-center gap-2">
                                {group.name}
                                {isOwner && (
                                  <FaCrown
                                    className="text-yellow-400 flex-shrink-0"
                                    size={12}
                                    title="Owner"
                                  />
                                )}
                              </div>
                              <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                                <span>{group.member_count || 0} members</span>
                                {group.owner_name && (
                                  <>
                                    <span>•</span>
                                    <span>By {group.owner_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Group Options Menu - Always Visible */}
                          <div className="relative" ref={menuRef}>
                            <button
                              onClick={(e) =>
                                toggleMenu(`group-${group.id}`, e)
                              }
                              className="p-1.5 text-gray-400 hover:text-gray-300 transition-all duration-200 rounded-lg hover:bg-blue-500/20"
                              title="Group options"
                            >
                              <FaEllipsisV size={12} />
                            </button>

                            {activeMenu === `group-${group.id}` && (
                              <div className={STYLES.menu}>
                                {isOwner ? (
                                  <button
                                    onClick={(e) =>
                                      deleteGroup(group.id, group.name, e)
                                    }
                                    className={STYLES.button.danger}
                                  >
                                    <FaExclamationTriangle
                                      className="mr-3"
                                      size={12}
                                    />
                                    Delete Group
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) =>
                                      leaveGroup(group.id, group.name, e)
                                    }
                                    className={STYLES.button.danger}
                                  >
                                    <FaUserMinus className="mr-3" size={12} />
                                    Leave Group
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className={STYLES.emptyState.container}>
                    <div className={STYLES.emptyState.icon}>
                      <FaUsers className="text-blue-400 text-2xl" />
                    </div>
                    <h3 className={STYLES.emptyState.title}>No Groups Yet</h3>
                    <p className={STYLES.emptyState.description}>
                      Create your first group to start chatting with multiple
                      people
                    </p>
                    <button
                      onClick={() => setShowGroupModal(true)}
                      className={STYLES.button.secondary}
                    >
                      Create Group
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Recent Chats Section */}
            {activeTab === "chats" && (
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                    <p className="text-sm text-gray-300">
                      Loading conversations...
                    </p>
                  </div>
                ) : conversations.length > 0 ? (
                  <>
                    <h4 className={STYLES.sectionHeader}>
                      Recent Chats ({conversations.length})
                    </h4>
                    {conversations.map((convoUser) => {
                      const isActive =
                        selectedUser?.id === convoUser.id &&
                        selectedUser?.type === "user";

                      return (
                        <div
                          key={convoUser.id}
                          className={STYLES.listItem(isActive)}
                          onClick={() =>
                            startChat({ ...convoUser, type: "user" })
                          }
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={STYLES.avatar(
                                getRandomColor(convoUser.name)
                              )}
                            >
                              <span className="font-semibold text-white text-sm">
                                {getInitials(convoUser.name)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white truncate flex items-center justify-between">
                                <span>{convoUser.name}</span>
                                {convoUser.last_message_at && (
                                  <span className="text-xs text-gray-400 font-normal">
                                    {getLastMessageTime(
                                      convoUser.last_message_at
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                @{convoUser.username}
                                {convoUser.last_message && (
                                  <span className="ml-2">
                                    • {convoUser.last_message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Conversation Options Menu - Always Visible */}
                          <div className="relative" ref={menuRef}>
                            <button
                              onClick={(e) =>
                                toggleMenu(`chat-${convoUser.id}`, e)
                              }
                              className="p-1.5 text-gray-400 hover:text-gray-300 transition-all duration-200 rounded-lg hover:bg-blue-500/20"
                              title="Conversation options"
                            >
                              <FaEllipsisV size={12} />
                            </button>

                            {activeMenu === `chat-${convoUser.id}` && (
                              <div className={STYLES.menu}>
                                <button
                                  onClick={(e) =>
                                    handleClearConversation(
                                      convoUser.id,
                                      convoUser.name,
                                      e
                                    )
                                  }
                                  className={STYLES.button.danger}
                                >
                                  <FaTrash className="mr-3" size={12} />
                                  Clear Conversation
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className={STYLES.emptyState.container}>
                    <div className={STYLES.emptyState.icon}>
                      <FaUserFriends className="text-blue-400 text-2xl" />
                    </div>
                    <h3 className={STYLES.emptyState.title}>
                      No Conversations Yet
                    </h3>
                    <p className={STYLES.emptyState.description}>
                      Start a new conversation by searching for users above
                    </p>
                    <button
                      onClick={() => setSearchQuery("test")}
                      className={STYLES.button.secondary}
                    >
                      Search Users
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Debug Info - Remove in production */}
      <div className="p-2 text-xs text-gray-500 border-t border-gray-700">
        <div>Conversations: {conversations.length}</div>
        <div>Groups: {groups.length}</div>
      </div>

      {/* AI Branding Footer */}
      <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
          <FaRobot className="text-blue-300" />
          <span>AI-Powered Chat Platform</span>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          Secure • Fast • Intelligent
        </p>
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <CreateGroupModal
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style> 
    </div>
  );
}