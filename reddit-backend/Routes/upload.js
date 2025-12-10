const express = require("express");
const multer = require("multer");
const cloudinary = require("../Db_config/cloudinary");
const Post = require("../Models/Post");
const User = require("../Models/User");

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });


router.post("/post/:postId", upload.single("file"), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "reddit_clone",
          resource_type: "auto"
      });

      const mediaType = result.resource_type; // image or video

      await Post.findByIdAndUpdate(req.params.postId, {
        mediaUrl: result.secure_url,
        mediaId: result.public_id,
        mediaType: mediaType
      });

      res.json({ success: true });

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
  }
});


// Profile Picture
router.post("/profile/:userId", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "reddit_clone/profile",
      resource_type: "auto"
    });

    await User.findByIdAndUpdate(req.params.userId, {
      profilePicture: result.secure_url
    });

    res.json({ success: true, url: result.secure_url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profile upload failed" });
  }
});

//Cover Picture
router.post("/cover/:userId", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "reddit_clone/cover",
      resource_type: "auto"
    });

    await User.findByIdAndUpdate(req.params.userId, {
      coverPicture: result.secure_url
    });

    res.json({ success: true, url: result.secure_url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cover upload failed" });
  }
});


module.exports = router;
