const express = require('express');
const { getHomeFeed, getPopularPostsHandler, getAllPosts } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHomeFeed);
router.get('/popular', getPopularPostsHandler);
router.get('/all', getAllPosts);

module.exports = router;