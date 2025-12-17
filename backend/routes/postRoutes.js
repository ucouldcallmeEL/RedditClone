const express = require("express");
const { getPostDetails } = require("../controllers/postController");
const Post = require("../schemas/post");

const router = express.Router();

// Existing behavior used by frontend: GET /post/:id (also works as GET /api/posts/:id once mounted there)
router.get("/:id", getPostDetails);

// Create a post (previously in post.routes.js)
// Intended mount: POST /api/posts/create
router.post("/create", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;