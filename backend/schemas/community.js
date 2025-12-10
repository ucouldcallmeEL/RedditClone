const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    coverPicture: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    },
    moderators: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;