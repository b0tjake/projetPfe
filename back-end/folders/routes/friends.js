const router = require("express").Router();
const User = require('../models/user');
const auth = require('../middleWare/authentification');

// POST /api/friends/send/:receiverId
router.post('/send/:receiverId', auth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;

  if (senderId === receiverId)
    return res.status(400).json({ message: "You can't add yourself!" });

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!receiver) return res.status(404).json({ message: "User not found." });

  if (sender.friendRequestsSent.includes(receiverId) || receiver.friendRequestsReceived.includes(senderId)) {
    return res.status(400).json({ message: "Friend request already sent." });
  }

  sender.friendRequestsSent.push(receiverId);
  receiver.friendRequestsReceived.push(senderId);

  await sender.save();
  await receiver.save();

  res.json({ message: "Friend request sent." });
});

// DELETE /api/friends/cancel/:receiverId
router.delete('/cancel/:receiverId', auth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  sender.friendRequestsSent.pull(receiverId);
  receiver.friendRequestsReceived.pull(senderId);

  await sender.save();
  await receiver.save();

  res.json({ message: "Friend request cancelled." });
});

// POST /api/friends/accept/:senderId
router.post('/accept/:senderId', auth, async (req, res) => {
  const receiverId = req.user.id;
  const { senderId } = req.params;

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!receiver.friendRequestsReceived.includes(senderId)) {
    return res.status(400).json({ message: "No friend request found." });
  }

  receiver.friendRequestsReceived.pull(senderId);
  sender.friendRequestsSent.pull(receiverId);

  receiver.friends.push(senderId);
  sender.friends.push(receiverId);

  await receiver.save();
  await sender.save();

  res.json({ message: "Friend request accepted." });
});

// DELETE /api/friends/decline/:senderId
router.delete('/decline/:senderId', auth, async (req, res) => {
  const receiverId = req.user.id;
  const { senderId } = req.params;

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  receiver.friendRequestsReceived.pull(senderId);
  sender.friendRequestsSent.pull(receiverId);

  await receiver.save();
  await sender.save();

  res.json({ message: "Friend request declined." });
});

module.exports = router;
