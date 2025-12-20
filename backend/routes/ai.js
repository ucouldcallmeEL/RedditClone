const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");

const genAI = new GoogleGenerativeAI("AIzaSyBYOXzytMZiGLz9zm1pEx0dO1RbjM5zHMs"); //add ur own key here 


router.post("/summarize/:postId", async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
    Summarize This Post in 1 Sentence.

    Title: ${post.title}

    Content:
    ${post.content}
    `;

    const result = await model.generateContent(prompt);

    res.json({
        postId: post._id,
        summary: result.response.text().trim(),
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;


