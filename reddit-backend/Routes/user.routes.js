const express = require("express");
const router = express.Router();

const User = require("../Models/User");

router.post("/create", async (req, res) => {
    try {
        const user = await User.create({ username: req.body.username });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
