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
  messages: propMessages,
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingMessages, setPendingMessages] = useState(new Set()); // Track pending messages
  // FIXED: Enhanced message sending with duplicate protection
const [lastSentMessage, setLastSentMessage] = useState("");
const [lastSentTime, setLastSentTime] = useState(0);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isGroup = selectedUser?.type === "group";
  const safePropMessages = Array.isArray(propMessages) ? propMessages : [];

  // Sync prop messages with local messages
  useEffect(() => {
    setLocalMessages(safePropMessages);
  }, [safePropMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages, replyingTo]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
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

  // Socket connection status
  useEffect(() => {
    if (socket) {
      setIsConnected(socket.connected);
      
      const handleConnect = () => {
        console.log("✅ Socket connected");
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [socket]);

  // Enhanced Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("🔌 Setting up socket listeners...");

    // Handle new private messages
    const handleNewMessage = (message) => {
      console.log("📩 New private message received:", message);
      
      setLocalMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(msg => 
          msg.id === message.id || 
          (msg.is_temp && msg.tempId === message.tempId)
        );
        
        if (!exists) {
          console.log("✅ Adding new private message to local state");
          // Remove temp message if exists and add real message
          const filteredPrev = prev.filter(msg => !msg.is_temp || msg.tempId !== message.tempId);
          return [...filteredPrev, message];
        }
        return prev;
      });

      // Remove from pending messages
      setPendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.tempId);
        return newSet;
      });

      if (onNewMessage) {
        onNewMessage(message);
      }
    };

    // Handle new group messages - FIXED: Optimistic updates for groups
      const handleNewGroupMessage = (message) => {
      // ADD THIS CHECK AT THE TOP:
      // If the message is from the current user, do nothing.
      // The 'messageSent' event you added to the backend will handle it.
      if (message.sender_id === user.id) {
        return;
      }

      // The rest of your original code runs only for messages from OTHERS.
      console.log("📩 New group message received from another user:", message);
      
      if (isGroup && selectedUser?.id === message.group_id) {
        setLocalMessages(prev => {
          const exists = prev.some(msg => 
            msg.id === message.id || 
            (msg.is_temp && msg.tempId === message.tempId)
          );
          
          if (!exists) {
            console.log("✅ Adding new group message to local state");
            // Remove temp message and add real message
            const filteredPrev = prev.filter(msg => !msg.is_temp || msg.tempId !== message.tempId);
            return [...filteredPrev, message];
          }
          return prev;
        });

        // This part might be redundant if the parent state is also updated,
        // but we'll keep it for now as per your original code.
        setPendingMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(message.tempId);
          return newSet;
        });

        if (onNewMessage) {
          onNewMessage(message);
        }
      }
    };

    // Handle message sent confirmation
    const handleMessageSent = (message) => {
      console.log("✅ Message sent confirmation:", message);
      setIsLoading(false);
      
      // Replace temp message with real one
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.is_temp && msg.tempId === message.tempId
            ? { ...message, id: message.id }
            : msg
        )
      );

      // Remove from pending messages
      setPendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.tempId);
        return newSet;
      });
    };

    // Handle message errors
    const handleMessageError = (error) => {
      console.error("❌ Message error:", error);
      setIsLoading(false);
      
      // Remove temp message on error
      setLocalMessages(prev => prev.filter(msg => !msg.is_temp));
      
      // Remove from pending messages
      setPendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.clear(); // Clear all pending messages on error
        return newSet;
      });
      
      alert(error.error || "Failed to send message");
    };

    // Handle AI responses
    const handleAIResponse = (data) => {
      console.log("🤖 AI response received:", data);
      if (onNewMessage) {
        onNewMessage(data);
      }
      // Also add to local messages
      setLocalMessages(prev => [...prev, data]);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageError", handleMessageError);
    socket.on("aiResponse", handleAIResponse);

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageError", handleMessageError);
      socket.off("aiResponse", handleAIResponse);
    };
  }, [socket, isConnected, isGroup, selectedUser, onNewMessage, user]);

  const fetchGroupMembers = useCallback(async () => {
    if (!isGroup || !selectedUser?.id) return;

    try {
      const response = await API.get(`/groups/${selectedUser.id}/members`);
      if (response.data?.success) {
        const members = response.data.data?.members || response.data.members || [];
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
  
  if (!newMessage.trim() || !selectedUser || isLoading) return;

  const messageContent = newMessage.trim();
  
  // DUPLICATE PROTECTION: Check if this is the same message sent recently
  const now = Date.now();
  if (messageContent === lastSentMessage && (now - lastSentTime) < 3000) {
    console.log("🛑 Duplicate message prevented");
    return;
  }

  // Check socket connection
  if (!socket || !isConnected) {
    alert("❌ Not connected to server. Please refresh the page.");
    return;
  }

  // OPTIMISTIC UPDATE: Add the message to UI immediately
  const tempMessage = {
    id: `temp-${Date.now()}`,
    message_content: messageContent,
    sender_id: user.id,
    sender_name: user.name,
    sender_username: user.username,
    timestamp: new Date().toISOString(),
    is_read: false,
    reactions: [],
    is_temp: true,
    ...(replyingTo && { 
      reply_to: replyingTo.id, 
      reply_to_content: replyingTo.message_content,
      reply_to_sender: replyingTo.sender_name 
    })
  };

  console.log("📤 Sending message optimistically:", tempMessage);

  // Update duplicate protection
  setLastSentMessage(messageContent);
  setLastSentTime(now);

  // Add to local messages immediately
  setLocalMessages(prev => [...prev, tempMessage]);
  setNewMessage("");
  setReplyingTo(null);
  setIsLoading(true);

  try {
    const messageData = {
      messageContent: messageContent,
      ...(replyingTo && { replyTo: replyingTo.id })
    };

    console.log("📤 Emitting socket message:", {
      isGroup,
      messageData,
      selectedUserId: selectedUser.id
    });

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

    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);

  } catch (error) {
    console.error('❌ Error emitting socket message:', error);
    // Remove temporary message on error
    setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    setIsLoading(false);
    // Clear duplicate protection on error
    setLastSentMessage("");
    setLastSentTime(0);
  }
};
  const handleNewMessageChange = (value) => {
    setNewMessage(value);
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
  };

  // Enhanced AI Chat Analysis
  const handleAnalyzeChat = async () => {
    if (!socket || !isConnected || isAnalyzing) {
      alert("❌ Not connected to server. Please check your connection.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const chatId = selectedUser.id;
      const chatType = isGroup ? "group" : "private";

      console.log(`🔍 Starting analysis for ${chatType} chat ${chatId}`);

      // Set up one-time listeners for analysis
      const analysisCompleteHandler = (data) => {
        console.log("✅ Analysis received");
        setIsAnalyzing(false);
        alert(`🤖 Chat Analysis:\n\n${data.analysis}`);
      };

      const analysisErrorHandler = (data) => {
        console.error("❌ Analysis error:", data.error);
        setIsAnalyzing(false);
        alert(`❌ Analysis Failed:\n\n${data.error}`);
      };

      socket.emit("analyzeChat", { chatId, chatType });
      
      // Set timeout for analysis
      const timeout = setTimeout(() => {
        socket.off("analysisComplete", analysisCompleteHandler);
        socket.off("analysisError", analysisErrorHandler);
        setIsAnalyzing(false);
        alert("🕒 Analysis is taking longer than expected. Please try again in a moment.");
      }, 35000);

      // Use once to automatically remove listeners after first call
      socket.once("analysisComplete", analysisCompleteHandler);
      socket.once("analysisError", analysisErrorHandler);

      // Cleanup timeout
      return () => clearTimeout(timeout);

    } catch (error) {
      console.error("Error analyzing chat:", error);
      setIsAnalyzing(false);
      alert("❌ Failed to start analysis. Please check your connection.");
    }
  };

  // Function to handle clearing private conversations
  const handleClearConversation = async () => {
    if (isGroup || !selectedUser) return;

    if (window.confirm("Are you sure you want to delete all messages in this conversation?")) {
      try {
        await API.delete(`/messages/conversation/${selectedUser.id}`);
        setLocalMessages([]);
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
    if (!trimmedContent) {
      alert("Message content cannot be empty");
      return;
    }

    const messageIdNum = parseInt(messageId);
    if (isNaN(messageIdNum)) {
      alert("Invalid message ID");
      return;
    }

    try {
      const url = isGroup
        ? `/groups/${selectedUser?.id}/messages/${messageIdNum}`
        : `/messages/${messageIdNum}`;

      console.log('🔄 Sending edit request:', { url, messageId: messageIdNum });

      const response = await API.put(url, { 
        message_content: trimmedContent 
      });

      console.log('✅ Edit response:', response.data);

      if (response.data?.success) {
        // Update local messages
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === messageIdNum 
              ? { ...msg, message_content: trimmedContent, edited_at: new Date().toISOString() }
              : msg
          )
        );
        
        if (onMessageUpdate) {
          onMessageUpdate(response.data.data);
        }
        setEditingMessage(null);
        setEditMessageContent("");
      } else {
        throw new Error(response.data?.message || "Edit failed");
      }
      
    } catch (error) {
      console.error("❌ Edit error:", error);
      alert(error.response?.data?.message || "Failed to update message");
    }
  };

  // Consolidated function to delete a message
  const handleDeleteMessage = async (messageId) => {
    try {
      const url = isGroup
        ? `/groups/${selectedUser.id}/messages/${messageId}`
        : `/messages/${messageId}`;

      console.log('🗑️ Deleting message:', { url, messageId, isGroup });

      await API.delete(url);

      // Remove from local messages
      setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      if (onMessageDelete) {
        onMessageDelete(messageId, isGroup ? selectedUser.id : null);
      }
      setShowMessageActionsModal(false);
      setSelectedMessage(null);
      
      console.log('✅ Message deleted successfully');
      
    } catch (error) {
      console.error("❌ Error deleting message:", error);
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  // Function to handle message reactions
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
        // Update local messages with new reactions
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, reactions: response.data.data || [] }
              : msg
          )
        );

        // Emit socket event for real-time updates
        if (socket && isConnected) {
          socket.emit("messageReaction", {
            messageId,
            reaction,
            isGroupMessage,
            userId: user.id,
          });
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

      // Update local messages
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: msg.reactions?.filter(r => r.user_id !== user.id) || [] }
            : msg
        )
      );

      // Emit socket event
      if (socket && isConnected) {
        socket.emit("removeReaction", {
          messageId,
          isGroupMessage,
          userId: user.id,
        });
      }
    } catch (error) {
      console.error("Error removing reaction:", error);
      alert(error.response?.data?.message || "Failed to remove reaction");
    }
  };

  const openMessageActions = (message) => {
    setSelectedMessage(message);
    setShowMessageActionsModal(true);
  };

  // Enhanced messages with reactions
  const messagesWithReactions = localMessages.map((msg) => ({
    ...msg,
    reactions: msg.reactions || [],
  }));

  if (!selectedUser) {
    return <EmptyState />;
  }

  return (
    <div className={`flex flex-col flex-grow ${STYLES.bg.main} relative overflow-hidden`}>

      {/* Pending Messages Indicator */}
      {pendingMessages.size > 0 && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm">
          ⏳ Sending {pendingMessages.size} message(s)... 
        </div>
      )}

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
        onAnalyzeChat={handleAnalyzeChat}
        isAnalyzing={isAnalyzing}
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
        onOpenMessageActions={openMessageActions}
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview replyingTo={replyingTo} onCancelReply={handleReplyCancel} />
      )}

      {/* Enhanced Message Input with Tagging */}
      <MessageInput
        newMessage={newMessage}
        isLoading={isLoading}
        selectedUser={selectedUser}
        isGroup={isGroup}
        onNewMessageChange={handleNewMessageChange}
        onSendMessage={handleSendMessage}
        API={API}
        user={user}
        onReplyCancel={handleReplyCancel}
        replyingTo={replyingTo}
        isConnected={isConnected}
      />

      {/* Rest of your modals remain the same */}
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
            const textarea = document.querySelector('textarea[data-editing="true"]');
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
  selectedUser={selectedUser}
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
      const response = await API.get(`/users/search`, {
        params: { q: query.trim() },
      });

      console.log("Search response:", response.data);

      let usersData = [];
      if (response.data?.success) {
        usersData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else {
        usersData = response.data?.users || response.data || [];
      }

      const filteredUsers = usersData.filter(
        (userResult) => !groupMembers.some((member) => member.id === userResult.id)
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
      console.log("🚀 Starting to add member...");
      console.log("User to add:", userToAdd);
      console.log("Selected group ID:", selectedUser?.id);
      console.log("Selected group:", selectedUser);

      if (!selectedUser?.id) {
        throw new Error("No group selected");
      }

      const payload = {
        userIdToAdd: userToAdd.id
      };
      console.log("Request payload:", payload);
      console.log("Request URL:", `/groups/${selectedUser.id}/members`);

      const response = await API.post(
        `/groups/${selectedUser.id}/members`,
        payload
      );
      
      console.log("✅ Add member response:", response.data);

      if (response.data?.success) {
        console.log("✅ Member added successfully");
        setGroupMembers((prev) => [
          ...prev,
          { ...userToAdd, role: 'member' },
        ]);
        setSearchUsers((prev) => prev.filter((u) => u.id !== userToAdd.id));
      } else {
        console.log("❌ Add member failed - no success flag");
        throw new Error(response.data?.message || "Failed to add member");
      }
    } catch (error) {
      console.error("❌ Error adding member:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      
      let errorMessage = "Failed to add member";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
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