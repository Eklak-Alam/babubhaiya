// socket/socketManager.js
const jwt = require('jsonwebtoken');
const db = require('../db');

const onlineUsers = new Map();

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

    // 2. Handle private messages with tagging
    socket.on('privateMessage', async ({ receiverId, messageContent }) => {
      const senderId = socket.userId;
      if (!senderId) return;

      try {
        // Process tags in message
        const { processedMessage, tags } = processMessageTags(messageContent);
        
        await db.query(
          'INSERT INTO messages (sender_id, receiver_id, message_content, tags) VALUES (?, ?, ?, ?)', 
          [senderId, receiverId, processedMessage, JSON.stringify(tags)]
        );

        const message = { 
          sender_id: senderId, 
          receiver_id: receiverId, 
          message_content: processedMessage,
          tags: tags,
          timestamp: new Date() 
        };

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', message);
        socket.emit('newMessage', message);

        // Handle AI tagging in private messages
        if (tags.includes('ai')) {
          handleAITagging(senderId, receiverId, processedMessage, 'private', io);
        }

      } catch (error) { 
        console.error('Error handling private message:', error); 
      }
    });
    
    // 3. Handle group messages with tagging
    socket.on('groupMessage', async ({ groupId, messageContent }) => {
        const senderId = socket.userId;
        if (!senderId) return console.log('Cannot send group message: sender not authenticated.');

        try {
            // Process tags in message
            const { processedMessage, tags } = processMessageTags(messageContent);
            
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

            // Handle AI tagging in group messages
            if (tags.includes('ai')) {
              handleAITagging(senderId, groupId, processedMessage, 'group', io);
            }

        } catch (error) {
            console.error('Error handling group message:', error);
        }
    });

    // 4. NEW: Handle chat analysis request
    socket.on('analyzeChat', async ({ chatId, chatType }) => {
      const userId = socket.userId;
      if (!userId) return;

      try {
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
             LIMIT 100`,
            [userId, chatId, chatId, userId]
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
             LIMIT 100`,
            [chatId]
          );
          chatHistory = messages.map(msg => `${msg.sender_name}: ${msg.message_content}`).join('\n');
        }

        // Send to AI service for analysis
        const aiResponse = await fetch('http://localhost:5002/ask', {
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

// Helper function to process tags in messages
function processMessageTags(messageContent) {
  const tagRegex = /@(\w+)/g;
  const tags = [];
  let processedMessage = messageContent;
  
  // Find all tags
  let match;
  while ((match = tagRegex.exec(messageContent)) !== null) {
    const tag = match[1].toLowerCase();
    tags.push(tag);
  }
  
  return { processedMessage, tags };
}

// Handle AI tagging and responses
async function handleAITagging(senderId, chatId, messageContent, chatType, io) {
  try {
    // Extract the actual question (remove the @ai tag)
    const question = messageContent.replace(/@ai\s*/i, '').trim();
    
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

    // Send to AI service
    const aiResponse = await fetch('http://localhost:5002/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        history: chatHistory, 
        question: question, 
        analysis_mode: false 
      }),
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const aiMessage = aiData.answer || "I'm sorry, I couldn't process your request.";

      // Save and broadcast AI response
      if (chatType === 'private') {
        await db.query(
          'INSERT INTO messages (sender_id, receiver_id, message_content, is_ai_response) VALUES (?, ?, ?, ?)',
          ['ai_bot', senderId, aiMessage, true]
        );
        
        const aiMessageObj = {
          sender_id: 'ai_bot',
          receiver_id: senderId,
          message_content: aiMessage,
          is_ai_response: true,
          timestamp: new Date()
        };
        
        const userSocketId = onlineUsers.get(senderId);
        if (userSocketId) io.to(userSocketId).emit('newMessage', aiMessageObj);
        
      } else if (chatType === 'group') {
        await db.query(
          'INSERT INTO group_messages (group_id, sender_id, message_content, is_ai_response) VALUES (?, ?, ?, ?)',
          [chatId, 'ai_bot', aiMessage, true]
        );
        
        const [users] = await db.query('SELECT name FROM users WHERE id = ?', [senderId]);
        const senderInfo = users[0];
        
        const aiMessageObj = {
          group_id: chatId,
          sender_id: 'ai_bot',
          message_content: aiMessage,
          is_ai_response: true,
          timestamp: new Date(),
          sender_name: 'Accord AI',
          sender_username: 'accord_ai'
        };
        
        const roomName = `group-${chatId}`;
        io.to(roomName).emit('newGroupMessage', aiMessageObj);
      }
    }
  } catch (error) {
    console.error('Error handling AI tagging:', error);
  }
}

module.exports = { initializeSocket };