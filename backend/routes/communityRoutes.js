const express = require('express');
const {
  getCommunityDetails,
  checkCommunityNameExists,
  postCommunity,
  fetchCommunitiesBySubstring,
  fetchUserCommunities,
} = require('../controllers/communityController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Check if community name exists (must come before /:communityName to avoid route conflict)
router.get('/check/:communityName', checkCommunityNameExists);

// Create a new community (protected - requires authentication)
router.post('/create', authenticate, postCommunity);

// Get community details by name
router.get('/:communityName', getCommunityDetails);

// Search communities by substring
router.get('/search/:substring', fetchCommunitiesBySubstring);

// Get current authenticated user's communities (protected - must come before /user/:userId)
router.get('/user/me', authenticate, async (req, res) => {
  // Use req.user from authenticate middleware
  req.params = { userId: req.user._id.toString() };
  await fetchUserCommunities(req, res);
});

// Get user's communities by userId (must come after /user/me)
router.get('/user/:userId', fetchUserCommunities);

module.exports = router;