const express = require("express");
const { getPostDetails, addPost, voteOnPost } = require("../controllers/postController");
const { getUpvotedPosts, getDownvotedPosts } = require("../managers/postManager");
const { getAllPosts, getHomeFeed, getPopularPostsHandler } = require("../controllers/homeController");
const { getPostsByUser } = require("../managers/postManager");
const { createComment } = require("../managers/commentManager");
const Post = require("../schemas/post");
const User = require("../schemas/user");
const { authenticate } = require('../middleware/auth');
const { attachUserIfPresent } = require('../middleware/auth');

const router = express.Router();

// Create a post (protected - requires authentication) - must come before /:id
router.post("/create", authenticate, addPost);

// Get all posts
router.get("/", attachUserIfPresent, getAllPosts);

// Get popular posts
router.get("/popular", attachUserIfPresent, getPopularPostsHandler);

// Get home feed posts (requires userId in query or authenticated user)
router.get("/home/:userId", attachUserIfPresent, getHomeFeed);

// Get posts by user
router.get("/user/:userId", attachUserIfPresent, async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await getPostsByUser(userId);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Get upvoted posts for current user
router.get("/upvoted/:userId", authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const posts = await getUpvotedPosts(req.params.userId);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching upvoted posts:', err);
    res.status(500).json({ error: 'Failed to fetch upvoted posts' });
  }
});

// Get downvoted posts for current user
router.get("/downvoted/:userId", authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const posts = await getDownvotedPosts(req.params.userId);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching downvoted posts:', err);
    res.status(500).json({ error: 'Failed to fetch downvoted posts' });
  }
});

// Vote on a post (protected)
router.post("/vote/:id", authenticate, voteOnPost);

// Accept alternate vote path for compatibility (/posts/:id/vote)
router.post("/:id/vote", authenticate, voteOnPost);

// Create a comment on a post (protected)
router.post("/:id/comments", authenticate, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, parentComment } = req.body || {};

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = await createComment({
      content: content.trim(),
      author: req.user._id,
      post: postId,
      parentComment: parentComment || null,
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    // also add to user's comments array
    await User.findByIdAndUpdate(req.user._id, { $push: { comments: newComment._id } });

    // populate author for frontend display
    await newComment.populate("author", "username name profilePicture");

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error("Failed to create comment", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Get post details by ID (must come last to avoid matching other routes)
// Attach user if token provided so responses can include `userVote` for authenticated callers
router.get("/:id", attachUserIfPresent, getPostDetails);

module.exports = router;