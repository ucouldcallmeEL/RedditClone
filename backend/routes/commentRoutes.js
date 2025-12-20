const express = require("express");
const { getCommentsByUser } = require("../managers/commentManager");

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

module.exports = router;
