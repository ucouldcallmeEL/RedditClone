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

// Authentication routes
router.post('/login', login);
router.post('/signup/check-email', checkEmail);
router.post('/signup', signup);
router.post('/reset-password/check', checkResetPassword);
router.post('/reset-password', resetPassword);
router.post('/phone/signin', phoneSignin);
router.post('/phone/signup', phoneSignup);
router.get('/generate-username', generateUsername);

module.exports = router;

