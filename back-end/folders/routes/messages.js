const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all conversations for the current user
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { recipient: req.userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'username fullname image')
    .populate('recipient', 'username fullname image');

    // Group messages by conversation
    const conversations = messages.reduce((acc, message) => {
      const otherUser = message.sender._id.toString() === req.userId
        ? message.recipient
        : message.sender;

      const existingConversation = acc.find(c => 
        c.participant._id.toString() === otherUser._id.toString()
      );

      if (!existingConversation) {
        acc.push({
          _id: message._id,
          participant: otherUser,
          lastMessage: message,
          unreadCount: message.recipient._id.toString() === req.userId && !message.read ? 1 : 0
        });
      } else if (message.createdAt > existingConversation.lastMessage.createdAt) {
        existingConversation.lastMessage = message;
        if (message.recipient._id.toString() === req.userId && !message.read) {
          existingConversation.unreadCount++;
        }
      }

      return acc;
    }, []);

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get messages between current user and another user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username fullname image')
    .populate('recipient', 'username fullname image');

    // Mark messages as read
    await Message.updateMany(
      {
        sender: req.params.userId,
        recipient: req.userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/:userId', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = new Message({
      sender: req.userId,
      recipient: req.params.userId,
      content
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username fullname image')
      .populate('recipient', 'username fullname image');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get unread message count
router.get('/unread/count', verifyToken, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
});

module.exports = router; 