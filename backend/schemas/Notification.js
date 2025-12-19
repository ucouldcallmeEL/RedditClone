const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {               
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {            
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {               // like 'comment', 'reply', 'upvote', 'follow'
      type: String,
      required: true,
    },
    post: {              
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {           
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    message: {           
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
