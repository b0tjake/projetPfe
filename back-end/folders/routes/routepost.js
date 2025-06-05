const express = require('express');
const Post = require('../models/post');
// const authMiddleware = require('../middleware/authMiddleware'); // JWT Middleware
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

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
      .populate('user', 'id fullname image')
      .populate('comments.user', 'id fullname image');

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
router.delete('/:id', async (req, res) => {
  try{
    const deletePost = await Post.findByIdAndDelete(req.params.id)
    if(!deletePost){
      return res.status(404).json({message : "Post not found"})
    }
    res.status(200).json({message : "Post deleted successfully"})
  }
  catch (err) {
    console.log("Couldn't delete post", err);
    res.status(400).json({ message: `Couldn't delete post ${err}`  });
  }
})

// Route to save a post
router.post('/:postId/save', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.savedBy.includes(userId)) {
      return res.status(400).json({ message: 'Post already saved' });
    }

    post.savedBy.push(userId);
    await post.save();

    // Populate the user field before sending response
    const populatedPost = await Post.findById(postId)
      .populate('user', 'id fullname image username')
      .populate('comments.user', 'id fullname image');

    res.json(populatedPost);
  } catch (err) {
    console.error('Error saving post:', err);
    res.status(500).json({ message: 'Error saving post', err: err.message });
  }
});

// Route to unsave a post
router.post('/:postId/unsave', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.savedBy = post.savedBy.filter(id => id.toString() !== userId);
    await post.save();

    // Populate the user field before sending response
    const populatedPost = await Post.findById(postId)
      .populate('user', 'id fullname image username')
      .populate('comments.user', 'id fullname image');

    res.json(populatedPost);
  } catch (err) {
    console.error('Error unsaving post:', err);
    res.status(500).json({ message: 'Error unsaving post', err: err.message });
  }
});

// Route to get saved posts
router.get('/saved', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const savedPosts = await Post.find({ savedBy: userId })
      .populate('user', 'id fullname image username')
      .populate('comments.user', 'id fullname image')
      .sort({ date: -1 });

    res.json(savedPosts);
  } catch (err) {
    console.error('Error fetching saved posts:', err);
    res.status(500).json({ message: 'Error fetching saved posts', err: err.message });
  }
});

module.exports = router;
