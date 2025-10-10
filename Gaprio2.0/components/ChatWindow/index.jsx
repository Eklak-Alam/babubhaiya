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
  onNewMessage,
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

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    // Handle new messages
    const handleNewMessage = (message) => {
      console.log("New message received:", message);
      if (onNewMessage) {
        onNewMessage(message);
      }
    };

    // Handle new group messages
    const handleNewGroupMessage = (message) => {
      console.log("New group message received:", message);
      if (onNewMessage && isGroup && selectedUser?.id === message.group_id) {
        onNewMessage(message);
      }
    };

    // Handle message reactions
    const handleMessageReaction = (data) => {
      console.log("Reaction update received:", data);
      // This will be handled by the parent component
    };

    // Handle AI responses
    const handleAIResponse = (data) => {
      console.log("AI response received:", data);
      if (onNewMessage) {
        onNewMessage(data);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("messageReactionUpdate", handleMessageReaction);
    socket.on("aiResponse", handleAIResponse);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("messageReactionUpdate", handleMessageReaction);
      socket.off("aiResponse", handleAIResponse);
    };
  }, [socket, isGroup, selectedUser, onNewMessage]);

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

      console.log("Sending message:", messageData);

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

    if (
      window.confirm(
        "Are you sure you want to delete all messages in this conversation?"
      )
    ) {
      try {
        await API.delete(`/messages/conversation/${selectedUser.id}`);
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

      if (response.data?.success && onMessageUpdate) {
        onMessageUpdate(response.data.data);
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
      throw new Error(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  };

  // New function to handle message reactions
  const handleAddReaction = async (messageId, reaction, isGroupMessage) => {
    try {
      console.log("Adding reaction:", { messageId, reaction, isGroupMessage });

      const endpoint = isGroupMessage
        ? `/groups/${selectedUser.id}/messages/${messageId}/reaction`
        : `/messages/${messageId}/reaction`;

      const response = await API.post(endpoint, {
        reaction,
        isGroupMessage,
      });

      console.log("Reaction response:", response.data);

      if (response.data?.success) {
        // Emit socket event for real-time updates
        if (socket) {
          socket.emit("messageReaction", {
            messageId,
            reaction,
            isGroupMessage,
            userId: user.id,
          });
        }

        // Refresh messages to get updated reactions
        // This should trigger a re-fetch in the parent component
        if (onNewMessage) {
          // Trigger a re-fetch by sending a dummy event
          onNewMessage({ type: "reaction_update", messageId });
        }
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      alert(error.response?.data?.message || "Failed to add reaction");
    }
  };

  // Function to remove reaction
  const handleRemoveReaction = async (messageId, isGroupMessage) => {
    try {
      const endpoint = isGroupMessage
        ? `/groups/${selectedUser.id}/messages/${messageId}/reaction`
        : `/messages/${messageId}/reaction`;

      await API.delete(endpoint);

      // Emit socket event
      if (socket) {
        socket.emit("removeReaction", {
          messageId,
          isGroupMessage,
          userId: user.id,
        });
      }

      // Refresh messages
      if (onNewMessage) {
        onNewMessage({ type: "reaction_remove", messageId });
      }
    } catch (error) {
      console.error("Error removing reaction:", error);
      alert(error.response?.data?.message || "Failed to remove reaction");
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const openMessageActions = (message) => {
    setSelectedMessage(message);
    setShowMessageActionsModal(true);
  };

  // Enhanced messages with reactions
  const messagesWithReactions = safeMessages.map((msg) => ({
    ...msg,
    reactions: msg.reactions || [], // Use reactions from the message data
  }));

  if (!selectedUser) {
    return <EmptyState />;
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
        onStartVoiceCall={() =>
          alert("Voice call feature would be implemented here")
        }
        onStartVideoCall={() =>
          alert("Video call feature would be implemented here")
        }
        onAnalyzeChat={async () => {
          if (!socket) return;

          try {
            const chatId = selectedUser.id;
            const chatType = isGroup ? "group" : "private";

            socket.emit("analyzeChat", { chatId, chatType });

            socket.once("analysisComplete", (data) => {
              alert(`Chat Analysis:\n\n${data.analysis}`);
            });

            socket.once("analysisError", (data) => {
              alert(`Analysis failed: ${data.error}`);
            });
          } catch (error) {
            console.error("Error analyzing chat:", error);
            alert("Failed to analyze chat");
          }
        }}
      />

      {/* Messages Area */}
      <MessageList
        ref={messagesContainerRef}
        messages={messagesWithReactions}
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
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview replyingTo={replyingTo} onCancelReply={cancelReply} />
      )}

      {/* Enhanced Message Input with Tagging */}
      <MessageInput
        newMessage={newMessage}
        isLoading={isLoading}
        selectedUser={selectedUser}
        isGroup={isGroup}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        API={API}
        user={user}
        onReplyCancel={cancelReply}
        replyingTo={replyingTo}
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

          setTimeout(() => {
            const textarea = document.querySelector(
              'textarea[data-editing="true"]'
            );
            if (textarea) {
              textarea.focus();
              textarea.scrollIntoView({ behavior: "smooth", block: "center" });
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
        onAddReaction={async (messageId, reaction) => {
          await handleAddReaction(messageId, reaction, isGroup);
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
              setGroupMembers((prev) =>
                prev.filter((member) => member.id !== memberId)
              );
              return Promise.resolve();
            } else {
              throw new Error(
                response.data?.message || "Failed to remove member"
              );
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

            if (response.data?.success || response.status === 200) {
              if (onGroupDelete) {
                onGroupDelete(selectedUser.id);
              }
              return Promise.resolve();
            } else {
              const errorMsg =
                response.data?.message || "Failed to delete group";
              throw new Error(errorMsg);
            }
          } catch (error) {
            console.error("Error deleting group:", error);
            if (
              error.response?.status === 200 ||
              error.response?.data?.success
            ) {
              if (onGroupDelete) {
                onGroupDelete(selectedUser.id);
              }
              return Promise.resolve();
            }
            throw new Error(
              error.response?.data?.message || "Failed to delete group"
            );
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
              throw new Error(
                response.data?.message || "Failed to leave group"
              );
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
        onGenerateInvite={async () => {
          try {
            const response = await API.post(
              `/groups/${selectedUser.id}/invite`
            );
            if (response.data?.success) {
              const inviteLink = response.data.data.invite_link;
              await navigator.clipboard.writeText(inviteLink);
              alert("Invite link copied to clipboard!");
              return Promise.resolve();
            }
          } catch (error) {
            console.error("Error generating invite:", error);
            alert(error.response?.data?.message || "Failed to generate invite");
            return Promise.reject(error);
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
          console.log("Searching for:", query);

          if (!query || query.trim().length < 2) {
            setSearchUsers([]);
            return;
          }

          setIsSearching(true);
          try {
            // Use proper API call with error handling
            const response = await API.get(`/tags/search-users`, {
              params: {
                query: query.trim(),
              },
            });

            console.log("Search response:", response.data);

            // Handle different response structures
            let usersData = [];
            if (response.data?.success) {
              usersData = response.data.data || [];
            } else if (Array.isArray(response.data)) {
              usersData = response.data;
            } else {
              usersData = response.data?.users || response.data || [];
            }

            // Filter out users already in the group
            const filteredUsers = usersData.filter(
              (userResult) =>
                !groupMembers.some((member) => member.id === userResult.id)
            );

            setSearchUsers(filteredUsers);
          } catch (error) {
            console.error("Error searching users:", error);
            console.error("Error details:", error.response?.data);
            setSearchUsers([]);

            // Show user-friendly error
            if (error.response?.status === 400) {
              console.log("Bad request - likely query too short or malformed");
            }
          } finally {
            setIsSearching(false);
          }
        }}
        onAddMember={async (userToAdd) => {
          try {
            const response = await API.post(
              `/groups/${selectedUser.id}/members`,
              {
                userIdToAdd: userToAdd.id,
              }
            );
            if (response.data?.success) {
              setGroupMembers((prev) => [
                ...prev,
                { ...userToAdd, is_owner: 0 },
              ]);
              setSearchUsers((prev) =>
                prev.filter((u) => u.id !== userToAdd.id)
              );
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
              onGroupUpdate(
                response.data.group || {
                  id: selectedUser.id,
                  name: editForm.name,
                  description: editForm.description,
                  ...response.data,
                }
              );
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
