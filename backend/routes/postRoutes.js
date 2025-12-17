const express = require("express");
const { getPostDetails, addPost } = require("../controllers/postController");
const { fetchCommunitiesBySubstring, fetchUserCommunities } = require('../controllers/communityController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get post details by ID
router.get("/:id", getPostDetails);

// Create a post (protected - requires authentication)
router.post("/create", authenticate, addPost);

// Community search routes (used by CreatePost page for community dropdown)
router.get('/communities/search/:substring', fetchCommunitiesBySubstring);
router.get('/communities/user/:userId', fetchUserCommunities);

module.exports = router;