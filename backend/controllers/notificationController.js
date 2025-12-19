const Notification = require("../schemas/Notification");

const getNotifications = async(req,res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate("sender", "username")
        .populate("post", "title");

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const markAllRead = async(req,res) => {
    try {
        await Notification.updateMany(
        { user: req.params.userId, isRead: false },
        { $set: {isRead: true} }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getUnread = async (req, res) => {
    try {
        const notifs = await Notification.find({
        user: req.params.userId,
        isRead: false
        }).sort({ createdAt: -1 });

        res.json(notifs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markOneRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.notifId, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.notifId);
        res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const clearAll = async (req, res) => {
    try {
        const userId = req.params.userId;

        await Notification.deleteMany({user:userId});

        res.json({
            success: true,
            message: "All notifications cleared for this user"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createNotificationTest = async(req,res) => {
    try {
        const { user, sender, type, message, post, comment } = req.body;

        const notif = await Notification.create({
        user,
        sender,
        type,
        message,
        post,
        comment,
        });

        res.json({ success: true, notification: notif });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  getNotifications,
  markAllRead,
  createNotificationTest,
  getUnread,
  markOneRead,
  deleteNotification,
  clearAll
};



