const Comment = require('../schemas/comment');

const createComment = async (comment) => {
    const newComment = new Comment(comment);
    await newComment.save();
    return newComment;
};

const getComment = async (id) => {
    const comment = await Comment.findById(id);
    return comment;
};

const getComments = async () => {
    const comments = await Comment.find();
    return comments;
};

const getCommentsByPost = async (postId) => {
    const comments = await Comment.find({ post: postId })
        .populate('author', 'username name profilePicture')
        .populate('parentComment')
        .sort({ createdAt: -1 });
    return comments;
};

const getCommentsByUser = async (userId) => {
    const comments = await Comment.find({ author: userId })
        .populate('post', 'title')
        .sort({ createdAt: -1 });
    return comments;
};

const updateComment = async (id, comment) => {
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, { new: true });
    return updatedComment;
};

const deleteComment = async (id) => {
    const deletedComment = await Comment.findByIdAndDelete(id);
    return deletedComment;
};

module.exports = {
    createComment,
    getComment,
    getComments,
    getCommentsByPost,
    getCommentsByUser,
    updateComment,
    deleteComment
};

