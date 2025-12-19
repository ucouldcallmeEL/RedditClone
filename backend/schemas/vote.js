const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    vote: {
        type: Number,
        enum: [-1, 1], // -1 for downvote, 1 for upvote
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user can only have one vote per post
voteSchema.index({ user: 1, post: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;