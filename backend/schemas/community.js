const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    coverPicture: {
        type: String,
        required: false
    },
    topics: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['public', 'restricted', 'private'],
        default: 'public'
    },
    isNSFW: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;