const express = require('express');
const router = express.Router();
const {
    login,
    checkEmail,
    signup,
    checkResetPassword,
    resetPassword,
    phoneSignin,
    phoneSignup,
    generateUsername
} = require('../controllers/userController');
const { getUser } = require('../managers/userManager');

// Authentication routes (public)
router.post('/login', login);
router.post('/signup/check-email', checkEmail);
router.post('/signup', signup);
router.post('/reset-password/check', checkResetPassword);
router.post('/reset-password', resetPassword);
router.post('/phone/signin', phoneSignin);
router.post('/phone/signup', phoneSignup);
router.get('/generate-username', generateUsername);

// Get user by ID (must come after other routes to avoid conflicts)
router.get('/:userId', async (req, res) => {
    try {
        const user = await getUser(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'User not found' });
    }
});

module.exports = router;

