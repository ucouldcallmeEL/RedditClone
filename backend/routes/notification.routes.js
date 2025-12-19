const express = require("express");
const notificationController = require("../controllers/notificationController");
const router = express.Router();

// Get all notifications
router.get("/:userId", notificationController.getNotifications);

// Get unread only
router.get("/unread/:userId", notificationController.getUnread);

// Mark all as read
router.put("/mark-read/:userId", notificationController.markAllRead);

// Mark a single notification
router.put("/mark-one/:notifId", notificationController.markOneRead);

// Delete one
router.delete("/:notifId", notificationController.deleteNotification);

// Clear all for user
router.delete("/clear/:userId", notificationController.clearAll);

// Testing create
router.post("/test-create", notificationController.createNotificationTest);

module.exports = router;
