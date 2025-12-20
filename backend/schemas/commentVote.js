const mongoose = require('mongoose');

const commentVoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  vote: {
    type: Number,
    enum: [-1, 1],
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure a user can only have one vote per comment
commentVoteSchema.index({ user: 1, comment: 1 }, { unique: true });

const CommentVote = mongoose.model('CommentVote', commentVoteSchema);

module.exports = CommentVote;
