const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

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

// LOGIN (find user by email)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                coverPicture: user.coverPicture,
                bio: user.bio,
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
});



module.exports = router;
