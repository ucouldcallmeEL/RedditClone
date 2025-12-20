const express = require('express');
const router = express.Router();
const modmailController = require('../controllers/modmailController');

router.get('/conversations', modmailController.getConversations);
router.post('/conversations', modmailController.createConversation);
router.get('/conversations/:id/messages', modmailController.getMessages);
router.post('/conversations/:id/messages', modmailController.sendMessage);
router.post('/conversations/:id/archive', modmailController.archiveConversation);

module.exports = router;
