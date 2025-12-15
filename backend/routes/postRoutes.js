const express = require('express');
const { getPostDetails } = require('../controllers/postController');

const router = express.Router();

router.get('/:id', getPostDetails);

module.exports = router;