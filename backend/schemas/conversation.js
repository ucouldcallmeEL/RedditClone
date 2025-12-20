const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isMod: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    user: {
        type: String, // Username of the user involved (the non-mod)
        required: true
    },
    subreddit: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Archived', 'Filtered'],
        default: 'New'
    },
    lastMessage: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    messages: [messageSchema]
}, { timestamps: true });

// Add a virtual for 'id' to match frontend expectations if necessary, or just use _id
conversationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        ret.id = doc._id; // Map _id to id for frontend compatibility
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);
