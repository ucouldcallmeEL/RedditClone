const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
        default: [] 
    }],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    //if the comment is a reply, it will have a parent comment
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;