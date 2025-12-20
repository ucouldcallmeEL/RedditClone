const Comment = require('../schemas/comment');
const CommentVote = require('../schemas/commentVote');

const createComment = async (comment) => {
    const newComment = new Comment(comment);
    await newComment.save();
    return newComment;
};

const getComment = async (id) => {
    const comment = await Comment.findById(id);
    return comment;
};

const getcommentreplies = async (id) => {
    const replies = await Comment.find({ parentComment: id });
    return replies;
};

const getCommentsByUser = async (id) => {
    const comments = await Comment.find({ author: id })
        .populate('author', 'username name profilePicture');
    return comments;
};

const getCommentsByPost = async (id) => {
    const comments = await Comment.find({ post: id })
        .populate('author', 'username name profilePicture');

    if (!comments || comments.length === 0) return comments;

    const commentIds = comments.map((c) => c._id);
    const votes = await CommentVote.find({ comment: { $in: commentIds } });

    const counts = {};
    votes.forEach((v) => {
        const key = v.comment.toString();
        if (!counts[key]) counts[key] = { upvotes: 0, downvotes: 0 };
        if (v.vote === 1) counts[key].upvotes += 1;
        else if (v.vote === -1) counts[key].downvotes += 1;
    });

    return comments.map((c) => {
        const key = c._id.toString();
        const { upvotes = 0, downvotes = 0 } = counts[key] || {};
        return { ...c.toObject(), upvotes, downvotes };
    });
};

const updateComment = async (id, comment) => {
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, { new: true });
    return updatedComment;
};

const deleteComment = async (id) => {
    const deletedComment = await Comment.findByIdAndDelete(id);
    return deletedComment;
};

const tallyVotes = async (commentId) => {
    const votes = await CommentVote.find({ comment: commentId });
    let upvotes = 0;
    let downvotes = 0;
    votes.forEach((v) => {
        if (v.vote === 1) upvotes += 1;
        else if (v.vote === -1) downvotes += 1;
    });
    await Comment.findByIdAndUpdate(commentId, { upvotes, downvotes });
    return { upvotes, downvotes };
};

const voteComment = async (commentId, userId, voteType) => {
    const comment = await Comment.findById(commentId).populate('author', 'username name profilePicture');
    if (!comment) throw new Error('Comment not found');

    let existingVote = await CommentVote.findOne({ user: userId, comment: commentId });
    let resultingVote = voteType;

    if (voteType === 0) {
        if (existingVote) {
            await CommentVote.findByIdAndDelete(existingVote._id);
        }
        resultingVote = 0;
    } else if (existingVote) {
        if (existingVote.vote === voteType) {
            await CommentVote.findByIdAndDelete(existingVote._id);
            resultingVote = 0;
        } else {
            existingVote.vote = voteType;
            await existingVote.save();
        }
    } else {
        const newVote = new CommentVote({ user: userId, comment: commentId, vote: voteType });
        await newVote.save();
    }

    const counts = await tallyVotes(commentId);
    const updatedComment = await Comment.findById(commentId).populate('author', 'username name profilePicture');

    return { comment: { ...updatedComment.toObject(), ...counts }, userVote: resultingVote };
};

module.exports = {
    createComment,
    getComment,
    getcommentreplies,
    getCommentsByUser,
    getCommentsByPost,
    updateComment,
    deleteComment,
    voteComment
};