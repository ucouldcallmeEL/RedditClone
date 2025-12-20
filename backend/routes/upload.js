const express = require("express");
const multer = require("multer");
const cloudinary = require("../managers/cloudinary");
const Community = require("../schemas/community");
// routes/ -> ../schemas/
// Note: filenames in /schemas are lowercase in this repo.
const Post = require("../schemas/post");
const User = require("../schemas/user");

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });


router.post("/post/:postId", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "reddit_clone/posts",
      resource_type: "auto",
    });

    const mediaEntry = {
      url: result.secure_url,
      mediaId: result.public_id,
      mediaType: result.resource_type === "video" ? "video" : "image",
    };

    await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { mediaUrls: mediaEntry } },
      { new: true }
    );

    res.json({ success: true, url: result.secure_url, mediaType: mediaEntry.mediaType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});


// Profile Picture
router.post("/profile/:userId", upload.single("file"), async (req, res) => {
  try {
    const secureUrl = await cloudinary.uploadImage(
      req.file.path,
      "reddit_clone/profile"
    );

    await User.findByIdAndUpdate(req.params.userId, {
      profilePicture: secureUrl,
    });

    res.json({ success: true, url: secureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profile upload failed" });
  }
});

//Cover Picture
router.post("/cover/:userId", upload.single("file"), async (req, res) => {
  try {
    const secureUrl = await cloudinary.uploadImage(
      req.file.path,
      "reddit_clone/cover"
    );

    await User.findByIdAndUpdate(req.params.userId, {
      coverPicture: secureUrl,
    });

    res.json({ success: true, url: secureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cover upload failed" });
  }
});

// Community icon
router.post("/community/:communityId/icon", upload.single("file"), async (req, res) => {
  try {
    const secureUrl = await cloudinary.uploadImage(
      req.file.path,
      "reddit_clone/community/icon"
    );

    await Community.findByIdAndUpdate(req.params.communityId, {
      profilePicture: secureUrl,
    });

    res.json({ success: true, url: secureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Community icon upload failed" });
  }
});

// Community banner
router.post("/community/:communityId/banner", upload.single("file"), async (req, res) => {
  try {
    const secureUrl = await cloudinary.uploadImage(
      req.file.path,
      "reddit_clone/community/banner"
    );

    await Community.findByIdAndUpdate(req.params.communityId, {
      coverPicture: secureUrl,
    });

    res.json({ success: true, url: secureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Community banner upload failed" });
  }
});


module.exports = router;
