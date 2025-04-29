const express = require('express');
const Post = require('../models/post');
// const authMiddleware = require('../middleware/authMiddleware'); // JWT Middleware
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for post image uploads
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'postImages/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const postUpload = multer({ storage: postStorage });

// Route to create a post
router.post('/', postUpload.single('image'), async (req, res) => {
  const { content, user } = req.body;
  const image = req.file ? req.file.path : null; // Image path from multer

  const newPost = new Post({
    content,
    user,
    image,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).send(err);

  }
});

// Route to fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username fullname image') // Populate user info (username, fullname, image)
      .populate('comments.user', 'username image') // Populate commenter user info
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching posts  ' + err });
  }
});

// Route to like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.body.user)) {
      post.likes = post.likes.filter((like) => like !== req.body.user);
    } else {
      post.likes.push(req.body.user);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Error liking post' });
  }
});

// Route to add a comment
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = {
      user: req.body.user,
      text: req.body.text,
    };

    post.comments.push(comment);
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Error adding comment' });
  }
});

module.exports = router;
