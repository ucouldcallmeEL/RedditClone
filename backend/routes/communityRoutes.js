const express = require('express');
const { getCommunityDetails } = require('../controllers/communityController');

const router = express.Router();

router.get('/:communityName', getCommunityDetails);

module.exports = router;