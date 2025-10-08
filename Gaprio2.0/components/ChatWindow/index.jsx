"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/ApiContext";
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
        messageContent: newMessage.trim(),
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
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
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
        onClearConversation={onClearConversation}
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
        onSaveEdit={async (messageId, content) => {
          try {
            const response = await API.put(`/messages/${messageId}`, {
              message_content: content.trim(),
            });
            if (response.data?.success && onMessageUpdate) {
              onMessageUpdate(messageId, content.trim());
            }
          } catch (error) {
            console.error("Error editing message:", error);
            alert(error.response?.data?.message || "Failed to update message");
          }
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
    
    return Promise.resolve(); // Return promise for loading state
  }}
  onDeleteMessage={async (messageId) => {
    try {
      const response = await API.delete(`/messages/${messageId}`);
      if (response.data?.success && onMessageDelete) {
        onMessageDelete(messageId);
        return Promise.resolve();
      } else {
        throw new Error(response.data?.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error(error.response?.data?.message || "Failed to delete message");
    }
  }}
  onCopyMessage={async (content) => {
    await navigator.clipboard.writeText(content);
    return Promise.resolve();
  }}
  onReplyToMessage={(message) => {
    setReplyingTo(message);
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
        return Promise.resolve(); // Return resolved promise for success handling
      } else {
        throw new Error(response.data?.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert(error.response?.data?.message || "Failed to remove member");
      return Promise.reject(error); // Return rejected promise for error handling
    }
  }}
onDeleteGroup={async () => {
  const response = await API.delete(`/groups/${selectedUser.id}`);
  
  if (response.data?.success) {
    if (onGroupDelete) {
      onGroupDelete(selectedUser.id);
    }
    // Success - promise will resolve
    return;
  } else {
    // Failure - promise will reject
    throw new Error(response.data?.message || "Failed to delete group");
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
    // This will be called when group is updated from EditGroupModal
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