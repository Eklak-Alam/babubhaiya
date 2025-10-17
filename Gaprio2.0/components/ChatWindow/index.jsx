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
  const [pendingMessages, setPendingMessages] = useState(new Set());

  // AI Loading State - with timeout cleanup
  const [isAIResponding, setIsAIResponding] = useState(false);
  const aiResponseTimeoutRef = useRef(null);

  const [lastSentMessage, setLastSentMessage] = useState("");
  const [lastSentTime, setLastSentTime] = useState(0);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isGroup = selectedUser?.type === "group";
  const safePropMessages = Array.isArray(propMessages) ? propMessages : [];

  // SIMPLIFIED AI Detection - Check for AI keywords in message content
  const isMessageToAI = (messageContent) => {
    return (
      messageContent.toLowerCase().includes("@ai") ||
      messageContent.toLowerCase().includes("ai") ||
      messageContent.toLowerCase().includes("accord")
    );
  };

  // Check if selected user is AI - More comprehensive
  const isAIChat =
    selectedUser &&
    (selectedUser.username?.toLowerCase().includes("ai") ||
      selectedUser.name?.toLowerCase().includes("ai") ||
      selectedUser.username?.toLowerCase().includes("accord") ||
      selectedUser.id?.toString().includes("ai") ||
      selectedUser.user_id?.toString().includes("ai"));

  // Sync prop messages with local messages
  useEffect(() => {
    setLocalMessages(safePropMessages);
  }, [safePropMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages, replyingTo, isAIResponding]);

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
    setIsAIResponding(false); // Reset AI loading when changing chats

    // Clear any existing timeout
    if (aiResponseTimeoutRef.current) {
      clearTimeout(aiResponseTimeoutRef.current);
    }

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

      setLocalMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.id === message.id ||
            (msg.is_temp && msg.tempId === message.tempId)
        );

        if (!exists) {
          console.log("✅ Adding new private message to local state");
          const filteredPrev = prev.filter(
            (msg) => !msg.is_temp || msg.tempId !== message.tempId
          );
          return [...filteredPrev, message];
        }
        return prev;
      });

      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(message.tempId);
        return newSet;
      });

      if (onNewMessage) {
        onNewMessage(message);
      }
    };

    // Handle new group messages
    const handleNewGroupMessage = (message) => {
      if (message.sender_id === user.id) {
        return;
      }

      console.log("📩 New group message received from another user:", message);

      if (isGroup && selectedUser?.id === message.group_id) {
        setLocalMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.id === message.id ||
              (msg.is_temp && msg.tempId === message.tempId)
          );

          if (!exists) {
            console.log("✅ Adding new group message to local state");
            const filteredPrev = prev.filter(
              (msg) => !msg.is_temp || msg.tempId !== message.tempId
            );
            return [...filteredPrev, message];
          }
          return prev;
        });

        setPendingMessages((prev) => {
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

      // SIMPLIFIED: Show loading for ANY message that mentions AI
      const shouldShowLoading =
        isMessageToAI(message.message_content) || isAIChat;

      if (shouldShowLoading && message.sender_id === user.id) {
        setIsAIResponding(true);
        console.log(
          "🤖 AI loading indicator shown - Message:",
          message.message_content
        );

        // Auto-hide after 30 seconds as fallback
        aiResponseTimeoutRef.current = setTimeout(() => {
          if (isAIResponding) {
            console.log("🕒 Auto-hiding AI loading after timeout");
            setIsAIResponding(false);
          }
        }, 30000);
      }

      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.is_temp && msg.tempId === message.tempId
            ? { ...message, id: message.id }
            : msg
        )
      );

      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(message.tempId);
        return newSet;
      });
    };

    // Handle message errors
    const handleMessageError = (error) => {
      console.error("❌ Message error:", error);
      setIsLoading(false);
      setIsAIResponding(false); // Hide AI loading on error

      // Clear timeout on error
      if (aiResponseTimeoutRef.current) {
        clearTimeout(aiResponseTimeoutRef.current);
      }

      setLocalMessages((prev) => prev.filter((msg) => !msg.is_temp));

      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.clear();
        return newSet;
      });

      alert(error.error || "Failed to send message");
    };

    // Handle AI responses - Hide loading when AI responds
    const handleAIResponse = (data) => {
      console.log("🤖 AI response received:", data);

      // Clear the timeout since we got a response
      if (aiResponseTimeoutRef.current) {
        clearTimeout(aiResponseTimeoutRef.current);
      }

      // Hide loading indicator FIRST
      setIsAIResponding(false);

      console.log("✅ AI loading hidden, adding AI message to local state");

      // Then add the AI message to local state
      setLocalMessages((prev) => {
        const newMessages = [...prev, data];
        console.log("📝 Local messages after AI response:", newMessages.length);
        return newMessages;
      });

      if (onNewMessage) {
        onNewMessage(data);
      }

      // Scroll to bottom to show the new AI message
      setTimeout(scrollToBottom, 100);
    };

    // NEW: Handle any incoming message from AI user
    const handleAnyAIMessage = (message) => {
      // Check if this message is from AI user
      const isFromAI =
        message.sender_name?.toLowerCase().includes("ai") ||
        message.sender_username?.toLowerCase().includes("ai") ||
        message.sender_id?.toString().includes("ai");

      if (isFromAI && isAIResponding) {
        console.log("🤖 Detected AI message, hiding loading:", message);

        // Clear timeout
        if (aiResponseTimeoutRef.current) {
          clearTimeout(aiResponseTimeoutRef.current);
        }

        // Hide loading
        setIsAIResponding(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageError", handleMessageError);
    socket.on("aiResponse", handleAIResponse);

    // Also listen to regular newMessage for AI responses
    socket.on("newMessage", handleAnyAIMessage);

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageError", handleMessageError);
      socket.off("aiResponse", handleAIResponse);
      socket.off("newMessage", handleAnyAIMessage);

      // Clear timeout on cleanup
      if (aiResponseTimeoutRef.current) {
        clearTimeout(aiResponseTimeoutRef.current);
      }
    };
  }, [
    socket,
    isConnected,
    isGroup,
    selectedUser,
    onNewMessage,
    user,
    isAIChat,
    isAIResponding,
    scrollToBottom,
  ]);

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

    if (!newMessage.trim() || !selectedUser || isLoading) return;

    const messageContent = newMessage.trim();

    // DEBUG: Check conditions
    console.log("🔍 DEBUG - Message to AI:", isMessageToAI(messageContent));
    console.log("🔍 DEBUG - isAIChat:", isAIChat);
    console.log("🔍 DEBUG - selectedUser:", selectedUser);
    console.log("🔍 DEBUG - messageContent:", messageContent);

    // DUPLICATE PROTECTION: Check if this is the same message sent recently
    const now = Date.now();
    if (messageContent === lastSentMessage && now - lastSentTime < 3000) {
      console.log("🛑 Duplicate message prevented");
      return;
    }

    // Check socket connection
    if (!socket || !isConnected) {
      alert("❌ Not connected to server. Please refresh the page.");
      return;
    }

    // OPTIMISTIC UPDATE: Add the message to UI immediately
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      message_content: messageContent,
      sender_id: user.id,
      sender_name: user.name,
      sender_username: user.username,
      timestamp: new Date().toISOString(),
      is_read: false,
      reactions: [],
      is_temp: true,
      tempId: tempId,
      ...(replyingTo && {
        reply_to: replyingTo.id,
        reply_to_content: replyingTo.message_content,
        reply_to_sender: replyingTo.sender_name,
      }),
    };

    console.log("📤 Sending message optimistically:", tempMessage);

    // Update duplicate protection
    setLastSentMessage(messageContent);
    setLastSentTime(now);

    // Add to local messages immediately
    setLocalMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setReplyingTo(null);
    setIsLoading(true);

    // SIMPLIFIED: Show loading immediately for AI messages
    if (isMessageToAI(messageContent) || isAIChat) {
      console.log("🚀 Immediately showing AI loading for:", messageContent);
      setIsAIResponding(true);
    }

    try {
      const messageData = {
        messageContent: messageContent,
        ...(replyingTo && { replyTo: replyingTo.id }),
      };

      console.log("📤 Emitting socket message:", {
        isGroup,
        messageData,
        selectedUserId: selectedUser.id,
        isAIChat,
        isMessageToAI: isMessageToAI(messageContent),
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
      console.error("❌ Error emitting socket message:", error);
      // Remove temporary message on error
      setLocalMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id)
      );
      setIsLoading(false);
      setIsAIResponding(false); // Hide AI loading on error

      // Clear timeout on error
      if (aiResponseTimeoutRef.current) {
        clearTimeout(aiResponseTimeoutRef.current);
      }

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

  // Enhanced AI Chat Analysis (with Modal integration)
  const handleAnalyzeChat = () => {
    // Return a new Promise. The ChatHeader component will await this promise.
    return new Promise((resolve, reject) => {
      if (!socket || !isConnected) {
        console.error("❌ Not connected to server.");
        reject(
          new Error("Not connected to server. Please check your connection.")
        );
        return;
      }

      try {
        const chatId = selectedUser.id;
        const chatType = isGroup ? "group" : "private";

        console.log(`🔍 Starting analysis for ${chatType} chat ${chatId}`);

        // --- NEW SAFER HANDLERS ---

        const analysisCompleteHandler = (data) => {
          console.log("✅ Analysis received:", data);

          // Server sent a complete object (GOOD)
          if (typeof data === "object" && data !== null) {
            resolve({
              summary:
                data.analysis ||
                data.summary ||
                "Analysis complete. No summary provided.",
              insights: data.insights || [
                "Successfully analyzed conversation.",
              ],
              sentiment: data.sentiment || null,
              statistics: data.statistics || null,
            });
          }
          // Server sent just a string (STILL OK)
          else if (typeof data === "string") {
            resolve({
              summary: data,
              insights: ["Analysis provided as raw text."],
            });
          }
          // Server sent something else (e.g., undefined)
          else {
            console.warn(
              "⚠️ Analysis data received in unexpected format:",
              data
            );
            resolve({
              summary: "Analysis complete, but data format was unexpected.",
              insights: ["Could not parse insights from server response."],
            });
          }
        };

        const analysisErrorHandler = (data) => {
          let errorMessage = "An unknown analysis error occurred.";
          if (typeof data === "object" && data !== null && data.error) {
            errorMessage = data.error;
          } else if (typeof data === "string") {
            errorMessage = data;
          }
          console.error("❌ Analysis error:", errorMessage);
          reject(new Error(errorMessage));
        };

        // --------------------------

        // Set timeout for analysis
        const analysisTimeout = setTimeout(() => {
          socket.off("analysisComplete", analysisCompleteHandler);
          socket.off("analysisError", analysisErrorHandler);
          reject(
            new Error(
              "Analysis is taking longer than expected. Please try again."
            )
          );
        }, 35000);

        // Use .once() to automatically remove listeners
        socket.once("analysisComplete", (data) => {
          clearTimeout(analysisTimeout);
          analysisCompleteHandler(data);
        });

        socket.once("analysisError", (data) => {
          clearTimeout(analysisTimeout);
          analysisErrorHandler(data);
        });

        // Emit the event to start the analysis
        socket.emit("analyzeChat", { chatId, chatType });
      } catch (error) {
        console.error("Error analyzing chat:", error);
        reject(error);
      }
    });
  };

  // Function to handle clearing private conversations
  const handleClearConversation = async () => {
    if (isGroup || !selectedUser) return;

    // We removed the `window.confirm`!
    // The modal in ChatHeader already confirmed this.
    try {
      await API.delete(`/messages/conversation/${selectedUser.id}`);
      setLocalMessages([]); // Clear the messages from the UI

      // --- NEW LINE ---
      // This will force a full page reload after the delete is successful.
      window.location.reload();

      // This part was in your original code.
      // If this component itself receives an `onClearConversation` prop,
      // you can leave this line.
      if (onClearConversation) {
        onClearConversation(selectedUser.id);
      }
    } catch (error) {
      console.error("Error clearing conversation:", error);
      // We still alert on an ERROR, but not for confirmation.
      alert(error.response?.data?.message || "Failed to clear conversation");
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

      console.log("🔄 Sending edit request:", { url, messageId: messageIdNum });

      const response = await API.put(url, {
        message_content: trimmedContent,
      });

      console.log("✅ Edit response:", response.data);

      if (response.data?.success) {
        // Update local messages
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageIdNum
              ? {
                  ...msg,
                  message_content: trimmedContent,
                  edited_at: new Date().toISOString(),
                }
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

      console.log("🗑️ Deleting message:", { url, messageId, isGroup });

      await API.delete(url);

      // Remove from local messages
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      if (onMessageDelete) {
        onMessageDelete(messageId, isGroup ? selectedUser.id : null);
      }
      setShowMessageActionsModal(false);
      setSelectedMessage(null);

      console.log("✅ Message deleted successfully");
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
        setLocalMessages((prev) =>
          prev.map((msg) =>
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
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions:
                  msg.reactions?.filter((r) => r.user_id !== user.id) || [],
              }
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
    <div
      className={`flex flex-col flex-grow ${STYLES.bg.main} relative overflow-hidden`}
    >
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
        onStartVoiceCall={() =>
          alert("Voice call feature would be implemented here")
        }
        onStartVideoCall={() =>
          alert("Video call feature would be implemented here")
        }
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
        isAIResponding={isAIResponding} // Always pass the state directly
      />

      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview
          replyingTo={replyingTo}
          onCancelReply={handleReplyCancel}
        />
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
              (userResult) =>
                !groupMembers.some((member) => member.id === userResult.id)
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
              userIdToAdd: userToAdd.id,
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
                { ...userToAdd, role: "member" },
              ]);
              setSearchUsers((prev) =>
                prev.filter((u) => u.id !== userToAdd.id)
              );
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
