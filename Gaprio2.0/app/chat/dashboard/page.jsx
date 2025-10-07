// app/(main)/page.jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import Sidebar from '@/components/chat/dashboard/Sidebar';
import ChatWindow from '@/components/chat/dashboard/ChatWindow';
import { useAuth } from '@/context/ApiContext';

export default function ChatPage() {
  const { user, API } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const socket = useRef(null);

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

  const handleSelectUser = async (userToSelect) => {
    setSelectedUser(userToSelect);
    try {
      let response;
      if (userToSelect.type === 'group') {
        response = await API.get(`/groups/${userToSelect.id}/messages`);
      } else {
        response = await API.get(`/messages/${userToSelect.id}`);
      }
      
      // SAFE MESSAGES SETTING - This ensures messages is always an array
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
      setMessages([]); // Always set to empty array on error
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        onSelectUser={handleSelectUser} 
        groups={groups} 
        setGroups={setGroups}
        onGroupDelete={handleGroupDelete}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        socket={socket.current}
        onGroupUpdate={handleGroupUpdate}
        onGroupDelete={handleGroupDelete}
      />
    </div>
  );
}