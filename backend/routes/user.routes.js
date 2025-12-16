const express = require("express");
const router = express.Router();
const User = require("../../reddit-backend/Models/User");

router.post("/create", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,        
            profilePicture: "",
            coverPicture: "",
            bio: "",
        });

        res.json({ success: true, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "User not found" });
    }
});


module.exports = router;
