const express = require('express');
const { getCommunityDetails, getAllCommunities } = require('../controllers/communityController');

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/:communityName', getCommunityDetails);

module.exports = router;