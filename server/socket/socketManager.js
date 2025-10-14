// socket/socketManager.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const fetch = require('node-fetch');

const onlineUsers = new Map();

// Your Google Colab AI Service URL - UPDATE THIS!
const AI_SERVICE_URL = "https://homozygous-cephalous-hee.ngrok-free.dev/";

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // 1. Authenticate and Join Rooms
    socket.on('authenticate', async (token) => {
      if (!token) return console.log(`Auth failed for ${socket.id}: No token.`);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;

        // Join group rooms
        const [memberships] = await db.query('SELECT group_id FROM group_members WHERE user_id = ?', [userId]);
        memberships.forEach(membership => {
          const roomName = `group-${membership.group_id}`;
          socket.join(roomName);
          console.log(`✅ User ${userId} joined room: ${roomName}`);
        });

        console.log(`✅ User ${userId} authenticated. Online users:`, Array.from(onlineUsers.keys()));

      } catch (error) {
        console.log(`Auth failed for ${socket.id}: Invalid token.`);
        socket.disconnect();
      }
    });

    // Enhanced message sending with notifications
    socket.on('privateMessage', async (data) => {
      const senderId = socket.userId;
      if (!senderId) return;

      try {
        const { receiverId, messageContent } = data;
        
        if (!messageContent?.trim()) {
          return socket.emit('messageError', { error: 'Message cannot be empty' });
        }

        // Process tags
        const { processedMessage, tags } = await processMessageTags(
          messageContent, senderId, 'private', receiverId
        );
        
        // Insert message
        const [result] = await db.query(
          'INSERT INTO messages (sender_id, receiver_id, message_content, tags) VALUES (?, ?, ?, ?)', 
          [senderId, receiverId, processedMessage, JSON.stringify(tags)]
        );

        // Get sender info for the response
        const [senderInfo] = await db.query(
          'SELECT name, username FROM users WHERE id = ?', 
          [senderId]
        );

        const message = { 
          id: result.insertId,
          sender_id: senderId, 
          receiver_id: receiverId, 
          message_content: processedMessage,
          tags: tags,
          timestamp: new Date(),
          sender_name: senderInfo[0].name,
          sender_username: senderInfo[0].username
        };

        // Send to receiver
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', message);
          
          // Send notification for mentions
          if (tags.mentions.some(mention => mention.userId === parseInt(receiverId))) {
            io.to(receiverSocketId).emit('notification', {
              type: 'mention',
              message: `${senderInfo[0].name} mentioned you in a message`,
              from: senderId,
              messageId: result.insertId
            });
          }
        }
        
        // Send back to sender
        socket.emit('messageSent', message);

        // Handle AI tagging - UPDATED: Uses Colab AI Service
        const hasAITag = tags.special.some(tag => tag.type === 'ai_request');
        if (hasAITag) {
          handleAITagging(senderId, receiverId, processedMessage, 'private', io);
        }

      } catch (error) { 
        console.error('Error handling private message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Fixed group message handler
    socket.on('groupMessage', async (data) => {
      const senderId = socket.userId;
      if (!senderId) return console.log('Cannot send group message: sender not authenticated.');

      try {
        const { groupId, messageContent } = data;
        
        if (!messageContent?.trim()) {
          return socket.emit('messageError', { error: 'Message cannot be empty' });
        }

        // Process tags with all parameters
        const { processedMessage, tags } = await processMessageTags(
          messageContent, senderId, 'group', groupId
        );
        
        // Insert message
        const [result] = await db.query(
          'INSERT INTO group_messages (group_id, sender_id, message_content, tags) VALUES (?, ?, ?, ?)',
          [groupId, senderId, processedMessage, JSON.stringify(tags)]
        );

        // Get sender info
        const [users] = await db.query('SELECT name, username FROM users WHERE id = ?', [senderId]);
        const senderInfo = users[0];

        const message = {
          id: result.insertId,
          group_id: groupId,
          sender_id: senderId,
          message_content: processedMessage,
          tags: tags,
          timestamp: new Date(),
          sender_name: senderInfo.name,
          sender_username: senderInfo.username
        };
        
        // Broadcast to group room
        const roomName = `group-${groupId}`;
        io.to(roomName).emit('newGroupMessage', message);

        socket.emit('messageSent', message);

        // Handle AI tagging in group messages - UPDATED: Uses Colab AI Service
        const hasAITag = tags.special.some(tag => tag.type === 'ai_request');
        if (hasAITag) {
          handleAITagging(senderId, groupId, processedMessage, 'group', io);
        }

      } catch (error) {
        console.error('Error handling group message:', error);
        socket.emit('messageError', { error: 'Failed to send group message' });
      }
    });

    // Enhanced chat analysis request - UPDATED: Uses Colab AI Service
    socket.on('analyzeChat', async ({ chatId, chatType }) => {
      const userId = socket.userId;
      if (!userId) return;

      try {
        let chatHistory = '';
        
        if (chatType === 'private') {
          // Verify user has access to this conversation
          const [access] = await db.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) LIMIT 1',
            [userId, chatId, chatId, userId]
          );
          
          if (access.length === 0) {
            return socket.emit('analysisError', { error: 'Access denied to this conversation' });
          }

          // Get private chat history
          const [messages] = await db.query(
            `SELECT m.*, u.name as sender_name 
             FROM messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE (m.sender_id = ? AND m.receiver_id = ?) 
             OR (m.sender_id = ? AND m.receiver_id = ?) 
             ORDER BY m.timestamp ASC 
             LIMIT 100`,
            [userId, chatId, chatId, userId]
          );
          chatHistory = messages.map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
        } else if (chatType === 'group') {
          // Verify user is member of group
          const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
            [chatId, userId]
          );
          
          if (membership.length === 0) {
            return socket.emit('analysisError', { error: 'You are not a member of this group' });
          }

          // Get group chat history
          const [messages] = await db.query(
            `SELECT gm.*, u.name as sender_name 
             FROM group_messages gm 
             JOIN users u ON gm.sender_id = u.id 
             WHERE gm.group_id = ? 
             ORDER BY gm.timestamp ASC 
             LIMIT 100`,
            [chatId]
          );
          chatHistory = messages.map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
        }

        // UPDATED: Send to Google Colab AI service for analysis
        const aiResponse = await fetch(`${AI_SERVICE_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            history: chatHistory, 
            question: '', 
            analysis_mode: true 
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          socket.emit('analysisComplete', { 
            chatId, 
            chatType,
            analysis: aiData.answer 
          });
        } else {
          socket.emit('analysisError', { error: 'AI analysis failed' });
        }

      } catch (error) {
        console.error('Error analyzing chat:', error);
        socket.emit('analysisError', { error: 'Analysis failed' });
      }
    });

    // 5. Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(`❌ User ${socket.userId} disconnected.`);
      }
    });
  });
};

// Enhanced processMessageTags function
async function processMessageTags(messageContent, senderId, chatType, chatId) {
  const mentionRegex = /@(\w+)/g;
  const userMentions = [];
  const specialTags = [];
  
  const potentialMentions = (messageContent.match(mentionRegex) || [])
    .map(mention => mention.substring(1));

  if (potentialMentions.length > 0) {
    // Check for special tags first
    for (const mention of potentialMentions) {
      const lowerMention = mention.toLowerCase();
      
      // Special tags
      if (lowerMention === 'ai' || lowerMention === 'bot') {
        specialTags.push({ type: 'ai_request', tag: lowerMention });
        continue;
      }
      if (lowerMention === 'all' || lowerMention === 'everyone') {
        if (chatType === 'group') {
          specialTags.push({ type: 'group_mention', tag: lowerMention });
        }
        continue;
      }
      
      // User mentions
      const [users] = await db.query(
        'SELECT id, username FROM users WHERE username = ? OR id = ?',
        [mention, parseInt(mention)]
      );

      if (users.length > 0) {
        userMentions.push({
          type: 'user_mention',
          userId: users[0].id,
          username: users[0].username,
          mentionedAt: new Date()
        });
      }
    }
  }

  // Check for hashtags
  const hashtagRegex = /#(\w+)/g;
  const hashtags = (messageContent.match(hashtagRegex) || [])
    .map(tag => tag.substring(1))
    .map(tag => ({ type: 'hashtag', tag }));

  return {
    processedMessage: messageContent,
    tags: {
      mentions: userMentions,
      special: specialTags,
      hashtags: hashtags
    }
  };
}

// Enhanced AI tagging and responses with better error handling - UPDATED for Colab
async function handleAITagging(senderId, chatId, messageContent, chatType, io) {
  try {
    // Extract the actual question (remove the @ai tag)
    const question = messageContent.replace(/@ai\s*/gi, '').replace(/@bot\s*/gi, '').trim();
    
    // If question is empty after removing tags, use a default
    if (!question) {
      const defaultQuestion = "How can I help you with this conversation?";
      return sendAIResponse(senderId, chatId, defaultQuestion, chatType, io, true);
    }
    
    let chatHistory = '';
    
    if (chatType === 'private') {
      // Get private chat history
      const [messages] = await db.query(
        `SELECT m.*, u.name as sender_name 
         FROM messages m 
         JOIN users u ON m.sender_id = u.id 
         WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?) 
         ORDER BY m.timestamp ASC 
         LIMIT 50`,
        [senderId, chatId, chatId, senderId]
      );
      chatHistory = messages.map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
    } else if (chatType === 'group') {
      // Get group chat history
      const [messages] = await db.query(
        `SELECT gm.*, u.name as sender_name 
         FROM group_messages gm 
         JOIN users u ON gm.sender_id = u.id 
         WHERE gm.group_id = ? 
         ORDER BY gm.timestamp ASC 
         LIMIT 50`,
        [chatId]
      );
      chatHistory = messages.map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
    }

    console.log(`🤖 AI Request from user ${senderId}: ${question}`);
    console.log(`📜 Chat History Length: ${chatHistory.length} characters`);
    console.log(`🌐 Using AI Service: ${AI_SERVICE_URL}`);

    // UPDATED: Enhanced AI service call to Google Colab
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: chatHistory, 
          question: question, 
          analysis_mode: false 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const aiMessage = aiData.answer || "I'm sorry, I couldn't process your request at the moment.";

        console.log(`🤖 AI Response (${aiMessage.length} chars): ${aiMessage.substring(0, 100)}...`);

        // Save and broadcast AI response
        await sendAIResponse(senderId, chatId, aiMessage, chatType, io, false);
        
      } else {
        console.error(`❌ AI service error: ${aiResponse.status} ${aiResponse.statusText}`);
        throw new Error(`AI service responded with ${aiResponse.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('⏰ AI request timeout');
        await sendAIResponse(senderId, chatId, 
          "I'm taking longer than usual to respond. Please try again in a moment.", 
          chatType, io, true
        );
      } else {
        throw fetchError;
      }
    }

  } catch (error) {
    console.error('❌ Error handling AI tagging:', error);
    
    // Enhanced error messages based on error type
    let errorMessage = "Sorry, I encountered an error while processing your request. ";
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      errorMessage += "The AI service appears to be offline. Please make sure the Google Colab AI service is running.";
    } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
      errorMessage += "The request timed out. Please try again.";
    } else if (error.message.includes('404')) {
      errorMessage += "AI service endpoint not found. Please check the Colab URL.";
    } else {
      errorMessage += "Please try again later.";
    }
    
    // Send error notification
    await sendAIError(senderId, chatId, errorMessage, chatType, io);
  }
}

// Helper function to send AI responses
async function sendAIResponse(senderId, chatId, aiMessage, chatType, io, isError = false) {
  try {
    if (chatType === 'private') {
      const [result] = await db.query(
        'INSERT INTO messages (sender_id, receiver_id, message_content, is_ai_response) VALUES (?, ?, ?, ?)',
        [5, senderId, aiMessage, true] // Using user_id 5 for Accord AI
      );
      
      const aiMessageObj = {
        id: result.insertId,
        sender_id: 5,
        receiver_id: senderId,
        message_content: aiMessage,
        is_ai_response: true,
        timestamp: new Date(),
        sender_name: 'Accord AI',
        sender_username: 'accord_ai',
        is_error: isError
      };
      
      // Send to both users in private chat
      const userSocketId = onlineUsers.get(senderId);
      const receiverSocketId = onlineUsers.get(chatId);
      
      if (userSocketId) io.to(userSocketId).emit('newMessage', aiMessageObj);
      if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', aiMessageObj);
      
    } else if (chatType === 'group') {
      const [result] = await db.query(
        'INSERT INTO group_messages (group_id, sender_id, message_content, is_ai_response) VALUES (?, ?, ?, ?)',
        [chatId, 5, aiMessage, true] // Using user_id 5 for Accord AI
      );
      
      const aiMessageObj = {
        id: result.insertId,
        group_id: chatId,
        sender_id: 5,
        message_content: aiMessage,
        is_ai_response: true,
        timestamp: new Date(),
        sender_name: 'Accord AI',
        sender_username: 'accord_ai',
        is_error: isError
      };
      
      // Broadcast to entire group
      const roomName = `group-${chatId}`;
      io.to(roomName).emit('newGroupMessage', aiMessageObj);
    }
    
    console.log(`✅ AI response sent successfully to ${chatType} chat`);
  } catch (dbError) {
    console.error('❌ Database error saving AI response:', dbError);
    // Fallback: Send via socket without saving to DB
    sendAIFallback(senderId, chatId, aiMessage, chatType, io, isError);
  }
}

// Helper function for AI errors
async function sendAIError(senderId, chatId, errorMessage, chatType, io) {
  const errorResponse = `🤖 Accord AI: ${errorMessage}`;
  await sendAIResponse(senderId, chatId, errorResponse, chatType, io, true);
}

// Fallback function if database is unavailable
function sendAIFallback(senderId, chatId, message, chatType, io, isError = false) {
  const aiMessageObj = {
    id: Date.now(), // Temporary ID
    sender_id: 5,
    message_content: message,
    is_ai_response: true,
    timestamp: new Date(),
    sender_name: 'Accord AI',
    sender_username: 'accord_ai',
    is_error: isError
  };

  if (chatType === 'private') {
    aiMessageObj.receiver_id = senderId;
    const userSocketId = onlineUsers.get(senderId);
    const receiverSocketId = onlineUsers.get(chatId);
    
    if (userSocketId) io.to(userSocketId).emit('newMessage', aiMessageObj);
    if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', aiMessageObj);
  } else {
    aiMessageObj.group_id = chatId;
    const roomName = `group-${chatId}`;
    io.to(roomName).emit('newGroupMessage', aiMessageObj);
  }
  
  console.log('📤 AI response sent via fallback method');
}

module.exports = { initializeSocket };