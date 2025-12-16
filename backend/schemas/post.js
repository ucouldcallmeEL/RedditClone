const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    mediaUrl: {
        type: String
    },
    mediaId: {
        type: String 
    },
    mediaType: {
        type: String,   
        enum: ["image", "video"]
    },
    
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;