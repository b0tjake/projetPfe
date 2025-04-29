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
      .populate('user', 'fullname image')
      .populate('comments.user', 'fullname image');

    // نحسب عدد اللايكات والكومنتات لكل بوست
    const updatedPosts = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      commentsCount: post.comments,
    }));

    res.json(updatedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', err });
  }
});


// Route to like a post
router.post('/like', async (req, res) => {
 const {postId,userId} = req.body
  try {
    const post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Error liking post',err });
  }
});

// Route to add a comment
// Route to add a comment
router.post('/comment', async (req, res) => {
  const { postId, userId, textValue } = req.body;

  try {
    const post = await Post.findById(postId);
    const comment = {
      user: userId,
      text: textValue,
    };

    post.comments.push(comment);
    await post.save();

    // Populate بعد ما كتسالي
    const updatedPost = await Post.findById(postId)
      .populate('comments.user', 'fullname image');

      res.json({
        comments: updatedPost.comments,
        commentsCount: updatedPost.comments.length
      });
       // رجع فقط الكومنتات populated
  } catch (err) {
    res.status(400).json({ message: 'Error adding comment', err });
  }
});


module.exports = router;
