const express = require("express");
const { getPostDetails, addPost, voteOnPost } = require("../controllers/postController");
const { getAllPosts, getHomeFeed, getPopularPostsHandler } = require("../controllers/homeController");
const { getPostsByUser } = require("../managers/postManager");
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create a post (protected - requires authentication) - must come before /:id
router.post("/create", authenticate, addPost);

// Get all posts
router.get("/", getAllPosts);

// Get popular posts
router.get("/popular", getPopularPostsHandler);

// Get home feed posts (requires userId in query or authenticated user)
router.get("/home/:userId", getHomeFeed);

// Get posts by user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await getPostsByUser(userId);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Vote on a post (protected)
router.post("/vote/:id", authenticate, voteOnPost);

// Accept alternate vote path for compatibility (/posts/:id/vote)
router.post("/:id/vote", authenticate, voteOnPost);

// Get post details by ID (must come last to avoid matching other routes)
router.get("/:id", getPostDetails);

module.exports = router;