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
// When a Vote document is removed via document.remove()
voteSchema.pre('remove', async function(next) {
    try {
        const Post = mongoose.model('Post');
        await Post.findByIdAndUpdate(this.post, { $pull: { vote: this._id } }).exec();
        next();
    } catch (e) {
        console.error('[voteSchema.pre remove] failed to pull vote from post', e);
        next(e);
    }
});

// When a Vote is deleted via query methods (findOneAndDelete / findByIdAndDelete / findOneAndRemove)
const removeHook = async function(doc) {
    if (!doc) return;
    try {
        const Post = mongoose.model('Post');
        await Post.findByIdAndUpdate(doc.post, { $pull: { vote: doc._id } }).exec();
    } catch (e) {
        console.error('[voteSchema.post findOneAndDelete] failed to pull vote from post', e);
    }
};

voteSchema.post('findOneAndDelete', removeHook);
voteSchema.post('findOneAndRemove', removeHook);

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;