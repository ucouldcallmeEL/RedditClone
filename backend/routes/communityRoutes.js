const express = require('express');
const { getCommunityDetails, getAllCommunities, getTopCommunitiesForUser } = require('../controllers/communityController');

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/user/:userId/top3communities', getTopCommunitiesForUser);
router.get('/:communityName', getCommunityDetails);
router.get('/:communityName/is-mod', (req, res) => {
  const { isModerator } = require('../controllers/communityController');
  return isModerator(req, res);
});
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