const express = require('express');
const {
  getCommunityDetails, getAllCommunities, getTopCommunitiesForUser,
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

// Search communities by substring (must come before /:communityName)
router.get('/search/:substring', fetchCommunitiesBySubstring);

// Get current authenticated user's communities (protected - must come before /user/:userId)
router.get('/user/me', authenticate, async (req, res) => {
  // Use req.user from authenticate middleware
  req.params = { userId: req.user._id.toString() };
  await fetchUserCommunities(req, res);
});

// Get user's communities by userId (must come after /user/me)
router.get('/user/:userId', fetchUserCommunities);

// Get community details by name (must come last to avoid matching other routes)
router.get('/communities', getAllCommunities);
router.get('/user/:userId/top3communities', getTopCommunitiesForUser);
router.get('/:communityName', getCommunityDetails);
// NOTE: Removed legacy `/is-mod` route; moderator checks are handled elsewhere.
// fetch resolved image URLs (Cloudinary-backed)
router.get('/:communityName/images', (req, res) => {
	const { getCommunityImages } = require('../controllers/communityController');
	return getCommunityImages(req, res);
});
router.post('/:communityName/join', (req, res) => {
	// placeholder route - controller will handle
	const { joinCommunity } = require('../controllers/communityController');
	return joinCommunity(req, res);
});

router.post('/:communityName/leave', (req, res) => {
	const { leaveCommunity } = require('../controllers/communityController');
	return leaveCommunity(req, res);
});

// image upload (avatar or cover) - moderators only
const multer = require('multer');
const upload = multer({ dest: 'tmp/uploads/' });
router.post('/:communityName/upload-image', upload.single('image'), (req, res) => {
  const { uploadCommunityImage } = require('../controllers/communityController');
  return uploadCommunityImage(req, res);
});

module.exports = router;