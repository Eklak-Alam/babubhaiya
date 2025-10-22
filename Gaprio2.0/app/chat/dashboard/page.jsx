// app/(main)/page.jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/chat/dashboard/Sidebar';
import { useAuth } from '@/context/ApiContext';
import ChatWindow from '@/components/ChatWindow';
import { useTheme } from '@/context/ThemeContext';

export default function ChatPage() {
  const { user, API } = useAuth();
  const { theme } = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const socket = useRef(null);
  const router = useRouter();

  // Theme-based styles
  const pageBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  // ✅ Check for token or user, otherwise redirect to /chat/login
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token || !user) {
      router.push('/chat/login');
      return;
    }
  }, [user, router]);

  // ✅ Socket connection and message handling
  useEffect(() => {
    if (!user) return;

    const token = Cookies.get('token');
    socket.current = io('http://localhost:3001');

    socket.current.emit('authenticate', token);

    socket.current.on('newMessage', (message) => {
      if (
        (message.sender_id === user.id && message.receiver_id === selectedUser?.id) ||
        (message.sender_id === selectedUser?.id && message.receiver_id === user.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.current.on('newGroupMessage', (message) => {
      if (selectedUser?.type === 'group' && message.group_id === selectedUser.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user, selectedUser]);

  // ✅ Handle user or group selection
  const handleSelectUser = async (userToSelect) => {
    setSelectedUser(userToSelect);
    setIsMobileSidebarOpen(false); // Close sidebar on mobile when selecting a chat
    
    try {
      let response;
      if (userToSelect.type === 'group') {
        response = await API.get(`/groups/${userToSelect.id}/messages`);
      } else {
        response = await API.get(`/messages/${userToSelect.id}`);
      }

      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setMessages(responseData);
      } else if (responseData && Array.isArray(responseData.messages)) {
        setMessages(responseData.messages);
      } else if (responseData && Array.isArray(responseData.data)) {
        setMessages(responseData.data);
      } else {
        console.warn('Unexpected API response format:', responseData);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };

  // ✅ Handle group updates and deletions
  const handleGroupUpdate = useCallback((updatedGroup) => {
    setGroups(prev => prev.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    
    if (selectedUser?.id === updatedGroup.id) {
      setSelectedUser(updatedGroup);
    }
  }, [selectedUser]);

  const handleGroupDelete = useCallback((deletedGroupId) => {
    setGroups(prev => prev.filter(group => group.id !== deletedGroupId));
    if (selectedUser?.id === deletedGroupId) {
      setSelectedUser(null);
      setMessages([]);
    }
  }, [selectedUser]);

  // ✅ Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Show empty state when no chat is selected
  const renderEmptyState = () => (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <svg 
          className={`w-12 h-12 transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </div>
      <h3 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Welcome to Chat
      </h3>
      <p className={`text-center mb-6 max-w-md transition-colors duration-200 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Select a conversation from the sidebar to start messaging. 
        You can chat with individual users or create groups for team conversations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 md:hidden ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Open Conversations
        </button>
        <button
          onClick={() => document.querySelector('input[placeholder="Search users..."]')?.focus()}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
          }`}
        >
          Search Users
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${pageBg} ${textColor} transition-colors duration-200`}>
      {/* Sidebar */}
      <Sidebar
        onSelectUser={handleSelectUser}
        onGroupDelete={handleGroupDelete}
        selectedUser={selectedUser}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            socket={socket.current}
            onGroupUpdate={handleGroupUpdate}
            onGroupDelete={handleGroupDelete}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
          />
        ) : (
          renderEmptyState()
        )}
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-200"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}