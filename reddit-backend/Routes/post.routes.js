const express = require("express");
const router = express.Router();
const Post = require("../Models/Post");


router.post("/create", async (req, res) => {
    try {
        const post = await Post.create({ title: req.body.title });
        res.json({ success: true, post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;