const express = require("express");
const router = express.Router();
const Post = require("../Models/Post");


router.post("/create", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;