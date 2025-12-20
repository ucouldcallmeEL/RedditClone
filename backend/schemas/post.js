const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
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
        ref: 'Comment',
        default: [] // Ensures consistency
    }],

    mediaUrls: [{
        url: {
            type: String,
            required: false
        },
        mediaId: {
            type: String
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: false
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
    // FIXED: Explicitly added default array and cleaned syntax
    vote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
        default: [] 
    }]
}, {
    timestamps: true,
    
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
module.exports = Post;