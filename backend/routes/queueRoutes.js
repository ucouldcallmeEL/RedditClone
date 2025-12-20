const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, queueController.getQueueItems);
router.post('/:id/approve', authenticate, queueController.approveItem);
router.post('/:id/remove', authenticate, queueController.removeItem);

module.exports = router;
