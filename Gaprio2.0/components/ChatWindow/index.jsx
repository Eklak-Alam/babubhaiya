// ChatWindow.js
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ReplyPreview from "./ReplyPreview";
import MessageActionsModal from "./MessageActionsModal";
import GroupInfoSidebar from "./GroupInfoSidebar";
import AddMemberModal from "./AddMemberModal";
import EditGroupModal from "./EditGroupModal";
import EmptyState from "./EmptyState";
import { STYLES } from "./styles";
import { useAuth } from "@/context/ApiContext";

export default function ChatWindow({
  selectedUser,
  messages,
  socket,
  onGroupUpdate,
  onGroupDelete,
  onMessageUpdate,
  onMessageDelete,
  onClearConversation,
}) {
  const { user, API } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [isSearching, setIsSearching] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showMessageActionsModal, setShowMessageActionsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isGroup = selectedUser?.type === "group";
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [safeMessages, replyingTo]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Initialize when selectedUser changes
  useEffect(() => {
    if (isGroup && selectedUser) {
      fetchGroupMembers();
      checkIfOwner();
      setEditForm({
        name: selectedUser.name,
        description: selectedUser.description || "",
      });
    } else {
      setGroupMembers([]);
      setIsOwner(false);
    }
    setReplyingTo(null);
    setEditingMessage(null);
    setShowMessageActionsModal(false);
    setTimeout(scrollToBottom, 100);
  }, [selectedUser, isGroup]);

  const fetchGroupMembers = useCallback(async () => {
    if (!isGroup || !selectedUser?.id) return;

    try {
      const response = await API.get(`/groups/${selectedUser.id}/members`);
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
    }
  }, [isGroup, selectedUser, API]);

  const checkIfOwner = useCallback(async () => {
    if (!isGroup || !selectedUser?.id) return;

    try {
      if (selectedUser.owner_id) {
        setIsOwner(selectedUser.owner_id === user.id);
        return;
      }

      const response = await API.get(`/groups/${selectedUser.id}/is-owner`);
      if (response.data?.success) {
        setIsOwner(response.data.data.isOwner);
      }
    } catch (error) {
      console.error("Error checking ownership:", error);
      setIsOwner(false);
    }
  }, [isGroup, selectedUser, user, API]);

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || !selectedUser || !socket || isLoading) return;

  setIsLoading(true);
  try {
    const messageData = {
      messageContent: newMessage.trim(), // This should match backend expectation
      replyTo: replyingTo?.id || null,
    };


    if (isGroup) {
      socket.emit("groupMessage", {
        groupId: selectedUser.id,
        ...messageData,
      });
    } else {
      socket.emit("privateMessage", {
        receiverId: selectedUser.id,
        ...messageData,
      });
    }
  
    setNewMessage("");
    setReplyingTo(null);
    setTimeout(scrollToBottom, 100);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  } finally {
    setIsLoading(false);
  }
};
  // Function to handle clearing private conversations
  const handleClearConversation = async () => {
    if (isGroup || !selectedUser) return;

    if (window.confirm("Are you sure you want to delete all messages in this conversation?")) {
      try {
        await API.delete(`/messages/conversation/${selectedUser.id}`);
        // Call the parent handler to update the global state
        if (onClearConversation) {
          onClearConversation(selectedUser.id);
        }
      } catch (error) {
        console.error("Error clearing conversation:", error);
        alert(error.response?.data?.message || "Failed to clear conversation");
      }
    }
  };

  // Consolidated function to save an edited message
  const handleSaveEdit = async (messageId, content) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    try {

      const url = isGroup
        ? `/groups/${selectedUser.id}/messages/${messageId}`
        : `/messages/${messageId}`;

      const response = await API.put(url, { message_content: trimmedContent });
      
      // Use the updated message from the API response to update state
      if (response.data?.success && onMessageUpdate) {
        onMessageUpdate(response.data.data); // Pass the full updated message object
      }
      setEditingMessage(null);
      setEditMessageContent("");
    } catch (error) {
      console.error("Error editing message:", error);
      alert(error.response?.data?.message || "Failed to update message");
    }
  };
  
  // Consolidated function to delete a message
  const handleDeleteMessage = async (messageId) => {
    try {
      const url = isGroup
        ? `/groups/${selectedUser.id}/messages/${messageId}`
        : `/messages/${messageId}`;
        
      await API.delete(url);

      if (onMessageDelete) {
        onMessageDelete(messageId, isGroup ? selectedUser.id : null);
      }
      setShowMessageActionsModal(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error(error.response?.data?.message || "Failed to delete message");
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const openMessageActions = (message) => {
    setSelectedMessage(message);
    setShowMessageActionsModal(true);
  };

  if (!selectedUser) {
    return (
      <EmptyState />
    );
  }

  return (
    <div
      className={`flex flex-col flex-grow ${STYLES.bg.main} relative overflow-hidden`}
    >
      {/* Header */}
      <ChatHeader
        selectedUser={selectedUser}
        isGroup={isGroup}
        isOwner={isOwner}
        groupMembers={groupMembers}
        onShowGroupInfo={() => setShowGroupInfo(true)}
        onClearConversation={handleClearConversation}
        onStartVoiceCall={() => alert("Voice call feature would be implemented here")}
        onStartVideoCall={() => alert("Video call feature would be implemented here")}
      />

      {/* Messages Area */}
      <MessageList
        ref={messagesContainerRef}
        messages={safeMessages}
        user={user}
        selectedUser={selectedUser}
        isGroup={isGroup}
        editingMessage={editingMessage}
        editMessageContent={editMessageContent}
        onEditMessage={setEditingMessage}
        onEditMessageContent={setEditMessageContent}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => {
          setEditingMessage(null);
          setEditMessageContent("");
        }}
        onOpenMessageActions={openMessageActions}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview replyingTo={replyingTo} onCancelReply={cancelReply} />
      )}

      {/* Message Input */}
      <MessageInput
        newMessage={newMessage}
        isLoading={isLoading}
        selectedUser={selectedUser}
        isGroup={isGroup}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
      />

      {/* Modals */}

      <MessageActionsModal
        isOpen={showMessageActionsModal}
        selectedMessage={selectedMessage}
        user={user}
        onClose={() => {
          setShowMessageActionsModal(false);
          setSelectedMessage(null);
        }}
        onEditMessage={(message) => {
          setEditingMessage(message.id);
          setEditMessageContent(message.message_content);
          setShowMessageActionsModal(false);
          setSelectedMessage(null);
          
          // Focus and scroll to textarea after a small delay
          setTimeout(() => {
            const textarea = document.querySelector('textarea[data-editing="true"]');
            if (textarea) {
              textarea.focus();
              textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          return Promise.resolve();
        }}
        onDeleteMessage={handleDeleteMessage}
        onCopyMessage={async (content) => {
          await navigator.clipboard.writeText(content);
          return Promise.resolve();
        }}
        onReplyToMessage={(message) => {
          setReplyingTo(message);
          setShowMessageActionsModal(false);
          setSelectedMessage(null);
          return Promise.resolve();
        }}
      />

<GroupInfoSidebar
  isOpen={showGroupInfo}
  selectedUser={selectedUser}
  isGroup={isGroup}
  isOwner={isOwner}
  groupMembers={groupMembers}
  user={user}
  onClose={() => setShowGroupInfo(false)}
  onShowAddMember={() => setShowAddMemberModal(true)}
  onShowEditGroup={() => setShowEditGroupModal(true)}
  onRemoveMember={async (memberId, memberName) => {
    try {
      const response = await API.delete(
        `/groups/${selectedUser.id}/members/${memberId}`
      );
      if (response.data?.success) {
        setGroupMembers(prev => prev.filter(member => member.id !== memberId));
        return Promise.resolve();
      } else {
        throw new Error(response.data?.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert(error.response?.data?.message || "Failed to remove member");
      return Promise.reject(error);
    }
  }}
  onDeleteGroup={async () => {
    try {
      const response = await API.delete(`/groups/${selectedUser.id}`);
      
      console.log("Delete group response:", response); // Debug log
      
      // FIX: Handle different response structures
      if (response.data?.success || response.status === 200) {
        if (onGroupDelete) {
          onGroupDelete(selectedUser.id);
        }
        return Promise.resolve();
      } else {
        // If the backend returns success but frontend throws error, check the actual response
        const errorMsg = response.data?.message || "Failed to delete group";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      // Check if this is actually a success case
      if (error.response?.status === 200 || error.response?.data?.success) {
        // This is actually a success - the group was deleted
        if (onGroupDelete) {
          onGroupDelete(selectedUser.id);
        }
        return Promise.resolve();
      }
      throw new Error(error.response?.data?.message || "Failed to delete group");
    }
  }}
  onLeaveGroup={async () => {
    try {
      const response = await API.delete(
        `/groups/${selectedUser.id}/members/${user.id}`
      );
      if (response.data?.success && onGroupDelete) {
        onGroupDelete(selectedUser.id);
        return Promise.resolve();
      } else {
        throw new Error(response.data?.message || "Failed to leave group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      alert(error.response?.data?.message || "Failed to leave group");
      return Promise.reject(error);
    }
  }}
  onGroupUpdate={(updatedGroup) => {
    if (onGroupUpdate) {
      onGroupUpdate(updatedGroup);
    }
  }}
/>
      <AddMemberModal
        isOpen={showAddMemberModal}
        searchQuery={searchQuery}
        searchUsers={searchUsers}
        isSearching={isSearching}
        groupMembers={groupMembers}
        onClose={() => {
          setShowAddMemberModal(false);
          setSearchQuery("");
          setSearchUsers([]);
        }}
        onSearchQueryChange={setSearchQuery}
        onSearchUsers={async (query) => {
          if (!query.trim()) {
            setSearchUsers([]);
            return;
          }
          setIsSearching(true);
          try {
            const response = await API.get(`/users/search?q=${query}`);
            const usersData = response.data || [];
            const filteredUsers = usersData.filter(
              userResult => !groupMembers.some(member => member.id === userResult.id)
            );
            setSearchUsers(filteredUsers);
          } catch (error) {
            console.error("Error searching users:", error);
            setSearchUsers([]);
          } finally {
            setIsSearching(false);
          }
        }}
        onAddMember={async (userToAdd) => {
          try {
            const response = await API.post(`/groups/${selectedUser.id}/members`, {
              userIdToAdd: userToAdd.id,
            });
            if (response.data?.success) {
              setGroupMembers(prev => [...prev, { ...userToAdd, is_owner: 0 }]);
              setSearchUsers(prev => prev.filter(u => u.id !== userToAdd.id));
              setShowAddMemberModal(false);
              setSearchQuery("");
            }
          } catch (error) {
            console.error("Error adding member:", error);
            alert(error.response?.data?.message || "Failed to add member");
          }
        }}
      />

      <EditGroupModal
        isOpen={showEditGroupModal}
        editForm={editForm}
        onClose={() => setShowEditGroupModal(false)}
        onEditFormChange={setEditForm}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editForm.name.trim()) {
            alert("Group name is required");
            return;
          }
          try {
            const response = await API.put(`/groups/${selectedUser.id}`, {
              name: editForm.name,
              description: editForm.description,
            });
            if (response.data?.success && onGroupUpdate) {
              onGroupUpdate(response.data.group || {
                id: selectedUser.id,
                name: editForm.name,
                description: editForm.description,
                ...response.data,
              });
              setShowEditGroupModal(false);
            }
          } catch (error) {
            console.error("Error editing group:", error);
            alert(error.response?.data?.message || "Failed to update group");
          }
        }}
      />

      <div ref={messagesEndRef} />
    </div>
  );
}