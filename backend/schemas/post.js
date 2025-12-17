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
    link: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: false
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    mediaUrls: [{
        url: {
            type: String,
            required: true
        },
        mediaId: {
            type: String
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true
        }
    }],
    
    tags: {
        nsfw: {
            type: Boolean,
            default: false
        },
        spoiler: {
            type: Boolean,
            default: false
        },
        brand: {
            type: Boolean,
            default: false
        }
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