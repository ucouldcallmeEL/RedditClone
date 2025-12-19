const { verifyToken } = require('../utils/auth');
const { getUser } = require('../managers/userManager');

// Middleware to authenticate requests
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Get user and attach to request
        const user = await getUser(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = {
    authenticate
};

