const express = require('express');
const router = express.Router();
const {
    getAllTopics,
    getTopicsByCategory,
    getTopicsList,
    createTopic
} = require('../controllers/topicController');

// Get all topics grouped by category (for Interests page)
router.get('/', getAllTopics);

// Get all topics as flat list
router.get('/list', getTopicsList);

// Get topics by category
router.get('/category/:category', getTopicsByCategory);

// Create a new topic (admin endpoint)
router.post('/', createTopic);

module.exports = router;
