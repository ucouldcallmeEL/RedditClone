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

const getcommentreplies = async (id) => {
    const replies = await Comment.find({ parentComment: id });
    return replies;
};

const getCommentsByUser = async (id) => {
    const comments = await Comment.find({ author: id });
    return comments;
};

const getCommentsByPost = async (id) => {
    const comments = await Comment.find({ post: id }).populate('author', 'name');
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
    getcommentreplies,
    getCommentsByUser,
    getCommentsByPost,
    updateComment,
    deleteComment
};