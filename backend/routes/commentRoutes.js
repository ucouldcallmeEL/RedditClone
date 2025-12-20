const express = require("express");
const { getCommentsByUser, voteComment } = require("../managers/commentManager");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Get comments by user (no auth required)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const comments = await getCommentsByUser(userId);
    res.json(comments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(500).json({ error: "Failed to fetch user comments" });
  }
});

// Vote on a comment (protected)
router.post("/vote/:id", authenticate, async (req, res) => {
  try {
    const commentId = req.params.id;
    const { vote } = req.body; // 1, -1, or 0 to clear
    const userId = req.user._id;

    if (![1, -1, 0].includes(vote)) {
      return res.status(400).json({ error: "Invalid vote value" });
    }

    const result = await voteComment(commentId, userId, vote);
    res.json(result);
  } catch (err) {
    console.error("Error voting on comment:", err);
    res.status(500).json({ error: err.message || "Failed to vote on comment" });
  }
});

module.exports = router;
