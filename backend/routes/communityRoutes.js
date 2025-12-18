const express = require('express');
const { getCommunityDetails, getAllCommunities } = require('../controllers/communityController');

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/:communityName', getCommunityDetails);
router.post('/:communityName/join', (req, res) => {
	// placeholder route - controller will handle
	const { joinCommunity } = require('../controllers/communityController');
	return joinCommunity(req, res);
});

router.post('/:communityName/leave', (req, res) => {
	const { leaveCommunity } = require('../controllers/communityController');
	return leaveCommunity(req, res);
});

module.exports = router;