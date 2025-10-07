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

        // --- NEW: JOIN GROUP ROOMS ---
        const [memberships] = await db.query('SELECT group_id FROM group_members WHERE user_id = ?', [userId]);
        memberships.forEach(membership => {
          const roomName = `group-${membership.group_id}`;
          socket.join(roomName);
          console.log(`✅ User ${userId} joined room: ${roomName}`);
        });
        // --- END NEW ---

        console.log(`✅ User ${userId} authenticated. Online users:`, Array.from(onlineUsers.keys()));

      } catch (error) {
        console.log(`Auth failed for ${socket.id}: Invalid token.`);
        socket.disconnect();
      }
    });

    // 2. Listen for private messages (no change here)
    socket.on('privateMessage', async ({ receiverId, messageContent }) => {
      // ... existing code for private messages
      const senderId = socket.userId;
      if (!senderId) return;
      try {
        await db.query('INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)', [senderId, receiverId, messageContent]);
        const receiverSocketId = onlineUsers.get(receiverId);
        const message = { sender_id: senderId, receiver_id: receiverId, message_content: messageContent, timestamp: new Date() };
        if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', message);
        socket.emit('newMessage', message);
      } catch (error) { console.error('Error handling private message:', error); }
    });
    
    // --- NEW: LISTEN FOR GROUP MESSAGES ---
    socket.on('groupMessage', async ({ groupId, messageContent }) => {
        const senderId = socket.userId;
        if (!senderId) return console.log('Cannot send group message: sender not authenticated.');

        try {
            // 1. Save message to the database
            const [result] = await db.query(
                'INSERT INTO group_messages (group_id, sender_id, message_content) VALUES (?, ?, ?)',
                [groupId, senderId, messageContent]
            );

            // 2. Get sender info to broadcast with the message
            const [users] = await db.query('SELECT name, username FROM users WHERE id = ?', [senderId]);
            const senderInfo = users[0];

            const message = {
                id: result.insertId,
                group_id: groupId,
                sender_id: senderId,
                message_content: messageContent,
                timestamp: new Date(),
                sender_name: senderInfo.name,
                sender_username: senderInfo.username
            };
            
            // 3. Broadcast to all members in the group room
            const roomName = `group-${groupId}`;
            io.to(roomName).emit('newGroupMessage', message);
            
        } catch (error) {
            console.error('Error handling group message:', error);
        }
    });
    // --- END NEW ---

    // 3. Handle user disconnection (no change here)
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(`❌ User ${socket.userId} disconnected. Online users:`, Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = { initializeSocket };
