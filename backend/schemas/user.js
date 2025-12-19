const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true // Allows multiple null values, but non-null values must be unique
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true // Allows multiple null values, but non-null values must be unique
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
    },
    coverPicture: {
        type: String,
    },
    bio: {
        type: String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    karma: {
        type: Number,
        default: 0
    },
    isModerator: {
        type: Boolean,
        default: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    notificationSettings: {
        email: {
            adminNotifications: {
                type: Boolean,
                default: true // Default to receiving admin notifications
            }
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;