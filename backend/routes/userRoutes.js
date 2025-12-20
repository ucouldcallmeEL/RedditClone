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
    generateUsername,
    updateSettings
} = require('../controllers/userController');
const { getUser, findByUsername } = require('../managers/userManager');
const { authenticate } = require('../middleware/auth');

// Authentication routes (public)
router.post('/login', login);
router.post('/signup/check-email', checkEmail);
router.post('/signup', signup);
router.post('/reset-password/check', checkResetPassword);
router.post('/reset-password', resetPassword);
router.post('/phone/signin', phoneSignin);
router.post('/phone/signup', phoneSignup);
router.get('/generate-username', generateUsername);
router.put('/update-settings', updateSettings);

// Get current authenticated user (must come before /username/:username)
router.get('/me', authenticate, async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        const userData = req.user.toObject();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get user by username (must come before /:userId to avoid conflicts)
router.get('/username/:username', async (req, res) => {
    try {
        const user = await findByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Remove password from response
        const userData = user.toObject();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        console.error('Error fetching user by username:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get user by ID (must come last to avoid conflicts)
router.get('/:userId', async (req, res) => {
    try {
        const user = await getUser(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Remove password from response
        const userData = user.toObject();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: 'User not found' });
    }
});

module.exports = router;

