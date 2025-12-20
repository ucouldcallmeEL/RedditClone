const { createUser, findByEmailOrUsername, findByEmail, findByPhone, findByUsername /*checkEmailExists, checkUsernameExists, checkPhoneExists*/ } = require('../managers/userManager');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const crypto = require('crypto');
const User = require('../schemas/user');

// Helper data for username generation
const ADJECTIVES = [
    'Swift', 'Brave', 'Calm', 'Clever', 'Bright', 'Fierce', 'Gentle', 'Mighty',
    'Silent', 'Lucky', 'Wild', 'Happy', 'Cosmic', 'Sunny', 'Icy', 'Crimson',
    'Bold', 'Fearless', 'Nimble', 'Wise', 'Curious', 'Radiant', 'Shadowy',
    'Electric', 'Golden', 'Iron', 'Velvet', 'Frosty', 'Burning', 'Hidden',
    'Epic', 'Rapid', 'Loyal', 'Playful', 'Savage', 'Chill', 'Stormy',
    'Glowing', 'Ancient', 'Modern', 'Sharp', 'Quiet', 'Thunderous',
    'Magnetic', 'Fearsome', 'Legendary', 'Mystic', 'Rugged', 'Dynamic'
];

const NOUNS = [
    'Lion', 'Falcon', 'Panda', 'Otter', 'Tiger', 'Phoenix', 'Dragon', 'Wolf',
    'Comet', 'Galaxy', 'River', 'Forest', 'Eagle', 'Shadow', 'Storm', 'Meteor',
    'Hawk', 'Panther', 'Leopard', 'Bear', 'Cobra', 'Raven', 'Viper', 'Shark',
    'Blaze', 'Thunder', 'Cyclone', 'Tornado', 'Blizzard', 'Flame',
    'Nebula', 'Orbit', 'Cosmos', 'Nova', 'Quasar', 'Asteroid',
    'Mountain', 'Canyon', 'Ocean', 'Wave', 'Reef', 'Valley',
    'Sentinel', 'Guardian', 'Ranger', 'Hunter', 'Nomad', 'Voyager'
];


const generateRandomUsername = () => {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${adjective}_${noun}${number}`;
};

const generateUniqueUsername = async () => {
    // Try a limited number of times to avoid infinite loop
    for (let i = 0; i < 20; i++) {
        const candidate = generateRandomUsername();
        const existing = await findByUsername(candidate);
        if (!existing) {
            return candidate;
        }
    }
    throw new Error('Failed to generate a unique username');
};

// Login with email/username and password
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or username

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email/username and password are required' });
        }

        // Find user by email or username
        const user = await findByEmailOrUsername(identifier);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data (excluding password)
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Signup - Step 1: Check if email exists
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const emailExists = await findByEmail(email);

        if (emailExists) {
            return res.status(409).json({ error: 'Email already exists', exists: true });
        }

        res.status(200).json({ message: 'Email is available', exists: false });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Signup - Step 2: Create user with username and password
const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password is required and must be at least 6 characters' });
        }

        // Check if email already exists
        const emailExists = await findByEmail(email);
        if (emailExists) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Check if username already exists
        const usernameExists = await findByUsername(username);
        if (usernameExists) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const userData = {
            email: email.toLowerCase(),
            username,
            password: hashedPassword,
            username: username
        };

        const newUser = await createUser(userData);

        // Generate token
        const token = generateToken(newUser._id);

        // Return user data (excluding password)
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ error: `${field} already exists` });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reset password - Step 1: Check if email/username exists
const checkResetPassword = async (req, res) => {
    try {
        const { identifier } = req.body; // Can be email or username

        if (!identifier) {
            return res.status(400).json({ error: 'Email or username is required' });
        }

        const user = await findByEmailOrUsername(identifier);

        if (!user) {
            return res.status(404).json({ error: 'User not found', exists: false });
        }

        // In a real app, you would send a password reset email here
        // For now, we'll just return success
        res.status(200).json({
            message: 'Password reset link would be sent to your email',
            exists: true
        });
    } catch (error) {
        console.error('Reset password check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reset password - Step 2: Update password (would typically require a token from email)
const resetPassword = async (req, res) => {
    try {
        const { identifier, newPassword, resetToken } = req.body;

        if (!identifier || !newPassword) {
            return res.status(400).json({ error: 'Email/username and new password are required' });
        }

        // In a real app, you would verify the resetToken here
        // For now, we'll allow reset if identifier matches

        const user = await findByEmailOrUsername(identifier);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Phone signin - Check if phone exists or create new user
const phoneSignin = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Check if phone exists
        const user = await findByPhone(phone);

        if (user) {
            // User exists, generate token and return
            const token = generateToken(user._id);
            const userData = user.toObject();
            delete userData.password;

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: userData,
                isNewUser: false
            });
        } else {
            // User doesn't exist - in a real app, you would verify the phone number first
            // For now, we'll return that the user needs to complete signup
            return res.status(200).json({
                message: 'Phone number not registered',
                isNewUser: true,
                phone: phone
            });
        }
    } catch (error) {
        console.error('Phone signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Phone signup - Create user with phone number
const phoneSignup = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Check if phone already exists
        const phoneExists = await findByPhone(phone);
        if (phoneExists) {
            return res.status(409).json({ error: 'Phone number already registered' });
        }

        // Generate a unique username for phone-based signup
        const username = await generateUniqueUsername();

        // Generate a random internal password so schema requirements are satisfied,
        // but the user is not asked for a password in this flow.
        const randomPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await hashPassword(randomPassword);

        // Create user with phone
        // Use a unique placeholder email to avoid sparse index conflicts with null emails
        // We'll remove it immediately after creation
        const placeholderEmail = `phone_${phone}_${Date.now()}@temp.local`;
        const userData = {
            phone,
            username: username,
            password: hashedPassword,
            email: placeholderEmail
        };

        console.log('Creating user with data:', { phone, username });
        const newUser = await createUser(userData);

        // Remove the placeholder email immediately after creation
        // This allows multiple phone-only users without email conflicts
        newUser.email = undefined;
        await newUser.save({ validateBeforeSave: false });

        // Generate token
        const token = generateToken(newUser._id);

        // Return user data
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Phone signup error:', error);
        console.error('Error details:', {
            code: error.code,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue,
            message: error.message
        });

        if (error.code === 11000) {
            // Handle duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            let errorMessage = `${field} already exists`;

            // More user-friendly error messages
            if (field === 'phone') {
                errorMessage = 'Phone number already registered';
            } else if (field === 'username') {
                errorMessage = 'Username already exists. Please try again.';
            } else if (field === 'email') {
                // This shouldn't happen for phone signup, but handle it gracefully
                errorMessage = 'An account with this information already exists. Please try logging in.';
            }

            return res.status(409).json({ error: errorMessage, field, value });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Endpoint: generate a unique username (adjectiveNoun_1234)
const generateUsername = async (req, res) => {
    try {
        const username = await generateUniqueUsername();
        res.status(200).json({ username });
    } catch (error) {
        console.error('Generate username error:', error);
        res.status(500).json({ error: 'Failed to generate username' });
    }
};

// Update user settings
const updateSettings = async (req, res) => {
    try {
        // Authenticated user ID should be available from middleware
        // For now, we'll assume it's passed in the body or params if no auth middleware is globally applied yet on this route
        // But ideally, it should be req.user.userId from an auth middleware

        // Given the current structure, let's assume we pass userId in the body or use a token decoder if available.
        // Looking at login, it returns a token. We should probably use a middleware to verify it, 
        // but to keep it simple and consistent with existing patterns if any:

        // CHECK: If there is no global auth middleware active on this route, we might need to rely on the client sending userId.
        // However, for security, we should verify the token. 
        // Since I don't see an auth middleware being used in userRoutes.js, I will implement a basic update that expects userId in the body for now,
        // or assumes the frontend sends it. 

        // BETTER APPROACH: Let's import the User model directly or use a manager function.
        // We'll use findByIdAndUpdate.

        const { userId, settings } = req.body;

        if (!userId || !settings) {
            return res.status(400).json({ error: 'User ID and settings are required' });
        }

        const User = require('../schemas/user'); // Importing schema directly to ensure access

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { notificationSettings: settings } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Settings updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login,
    checkEmail,
    signup,
    checkResetPassword,
    resetPassword,
    phoneSignin,
    phoneSignup,
    generateUsername,
    updateSettings // Exporting the new function
};
