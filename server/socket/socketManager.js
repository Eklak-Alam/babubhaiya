// socket/socketManager.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const fetch = require('node-fetch');

const onlineUsers = new Map();

// Updated to use your local Ollama AI service
const AI_SERVICE_URL = "http://localhost:5001";
const AI_USER_ID = 5; // The dedicated ID for the AI user from your database

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

        // Handle AI tagging
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

        // Handle AI tagging in group messages
        const hasAITag = tags.special.some(tag => tag.type === 'ai_request');
        if (hasAITag) {
          handleAITagging(senderId, groupId, processedMessage, 'group', io);
        }

      } catch (error) {
        console.error('Error handling group message:', error);
        socket.emit('messageError', { error: 'Failed to send group message' });
      }
    });

    // Enhanced chat analysis request
    socket.on('analyzeChat', async ({ chatId, chatType }) => {
      const userId = socket.userId;
      if (!userId) return;

      try {
        let chatHistory = '';
        
        if (chatType === 'private') {
          const [access] = await db.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) LIMIT 1',
            [userId, chatId, chatId, userId]
          );
          if (access.length === 0) {
            return socket.emit('analysisError', { error: 'Access denied to this conversation' });
          }
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
          const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
            [chatId, userId]
          );
          if (membership.length === 0) {
            return socket.emit('analysisError', { error: 'You are not a member of this group' });
          }
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

        // Send to local Ollama AI service for analysis
        const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_data: chatHistory, 
            user_prompt: "Please analyze this conversation and provide insights about the discussion, topics covered, and any notable patterns."
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          socket.emit('analysisComplete', { 
            chatId, 
            chatType,
            analysis: aiData.response || aiData.answer 
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
    for (const mention of potentialMentions) {
      const lowerMention = mention.toLowerCase();
      
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

// Enhanced AI tagging and responses - Stores AI messages in the conversation
async function handleAITagging(senderId, chatId, messageContent, chatType, io) {
  try {
    const question = messageContent.replace(/@ai\s*/gi, '').replace(/@bot\s*/gi, '').trim();
    
    if (!question) {
      return sendAIResponse(senderId, chatId, "How can I help you with this conversation?", chatType, io, true);
    }
    
    let chatHistory = '';
    
    if (chatType === 'private') {
      const [messages] = await db.query(
        `SELECT m.*, u.name as sender_name 
         FROM messages m 
         JOIN users u ON m.sender_id = u.id 
         WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?) 
         ORDER BY m.timestamp DESC 
         LIMIT 50`,
        [senderId, chatId, chatId, senderId]
      );
      chatHistory = messages.reverse().map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
    } else if (chatType === 'group') {
      const [messages] = await db.query(
        `SELECT gm.*, u.name as sender_name 
         FROM group_messages gm 
         JOIN users u ON gm.sender_id = u.id 
         WHERE gm.group_id = ? 
         ORDER BY gm.timestamp DESC 
         LIMIT 50`,
        [chatId]
      );
      chatHistory = messages.reverse().map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
    }

    console.log(`🤖 AI Request from user ${senderId}: ${question}`);
    console.log(`📜 Chat History Length: ${chatHistory.length} characters`);
    console.log(`🌐 Using Local AI Service: ${AI_SERVICE_URL}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_data: chatHistory, 
          user_prompt: question
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const aiMessage = aiData.response || "I'm sorry, I couldn't process your request at the moment.";
        console.log(`🤖 AI Response (${aiMessage.length} chars): ${aiMessage.substring(0, 100)}...`);
        await sendAIResponse(senderId, chatId, aiMessage, chatType, io, false);
      } else {
        console.error(`❌ AI service error: ${aiResponse.status} ${aiResponse.statusText}`);
        throw new Error(`AI service responded with ${aiResponse.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('⏰ AI request timeout');
        await sendAIResponse(senderId, chatId, "I'm taking longer than usual to respond. Please try again in a moment.", chatType, io, true);
      } else {
        throw fetchError;
      }
    }
  } catch (error) {
    console.error('❌ Error handling AI tagging:', error);
    let errorMessage = "Sorry, I encountered an error while processing your request. ";
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      errorMessage += "The AI service appears to be offline. Please make sure your local Ollama service is running on port 5001.";
    } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
      errorMessage += "The request timed out. Please try again.";
    } else if (error.message.includes('404')) {
      errorMessage += "AI service endpoint not found. Please check the service URL.";
    } else {
      errorMessage += "Please try again later.";
    }
    await sendAIResponse(senderId, chatId, errorMessage, chatType, io, true);
  }
}

// **FIXED**: Helper function to send and store AI responses correctly
async function sendAIResponse(senderId, chatId, aiMessage, chatType, io, isError = false) {
  try {
    const aiTags = JSON.stringify({ 
      mentions: [], 
      special: [{ type: 'ai_response', tag: 'ai' }], 
      hashtags: [] 
    });

    if (chatType === 'private') {
      // Store the message in the database as part of the conversation thread.
      // It's saved as "from the user who asked" to ensure it's fetched on reload.
      const [result] = await db.query(
        'INSERT INTO messages (sender_id, receiver_id, message_content, is_ai_response, tags) VALUES (?, ?, ?, ?, ?)',
        [senderId, chatId, aiMessage, true, aiTags]
      );
      
      // **THE FIX**: Create a message object for REAL-TIME broadcast that clearly identifies the AI as the sender.
      const aiMessageObj = {
        id: result.insertId,
        sender_id: AI_USER_ID, // Use the AI's actual user ID.
        receiver_id: chatId,
        message_content: aiMessage,
        is_ai_response: true,
        tags: JSON.parse(aiTags),
        timestamp: new Date(),
        sender_name: 'Accord AI', // Use the AI's name.
        sender_username: 'accord_ai', // Use the AI's username.
        is_error: isError
      };
      
      // Send this AI-branded message to both users in the private chat.
      const userSocketId = onlineUsers.get(senderId);
      const receiverSocketId = onlineUsers.get(chatId);
      
      if (userSocketId) io.to(userSocketId).emit('newMessage', aiMessageObj);
      if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', aiMessageObj);
      
    } else if (chatType === 'group') {
      // Group logic is already correct, using the AI user ID as the sender.
      const [result] = await db.query(
        'INSERT INTO group_messages (group_id, sender_id, message_content, is_ai_response, tags) VALUES (?, ?, ?, ?, ?)',
        [chatId, AI_USER_ID, aiMessage, true, aiTags]
      );
      
      const aiMessageObj = {
        id: result.insertId,
        group_id: chatId,
        sender_id: AI_USER_ID,
        message_content: aiMessage,
        is_ai_response: true,
        tags: JSON.parse(aiTags),
        timestamp: new Date(),
        sender_name: 'Accord AI',
        sender_username: 'accord_ai',
        is_error: isError
      };
      
      const roomName = `group-${chatId}`;
      io.to(roomName).emit('newGroupMessage', aiMessageObj);
    }
    
    console.log(`✅ AI response sent successfully to ${chatType} chat`);
  } catch (dbError) {
    console.error('❌ Database error saving AI response:', dbError);
  }
}

module.exports = { initializeSocket };