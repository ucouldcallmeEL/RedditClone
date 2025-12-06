const mongoose = require('mongoose');

uri="mongodb+srv://yehiasalman48_db_user:Y0114487332y@redditclone.tqtlvsk.mongodb.net/?appName=redditClone"
const databaseConnection = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }};



//users functions

const createUser = async (user) => {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
};

const getUser = async (id) => {
    const user = await User.findById(id);
    return user;
};

const getUsers = async () => {
    const users = await User.find();
    return users;
};

const updateUser = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
};
const deleteUser = async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
};
const getusersByCommunity = async (id) => {
    const users = await User.find({ communities: id });
    return users;
};



//posts functions
const createPost = async (post) => {
    const newPost = new Post(post);
    await newPost.save();
    return newPost;
};

const getPost = async (id) => {
    const post = await Post.findById(id);
    return post;
};

const getPosts = async () => {
    const posts = await Post.find();
    return posts;
};

const getPostComments = async (id) => {
    const comments = await Comment.find({ post: id });
    return comments;
};

const getPostsByUser = async (id) => {
    const posts = await Post.find({ author: id });
    return posts;
};

const updatePost = async (id, post) => {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    return updatedPost;
};
const deletePost = async (id) => {
    const deletedPost = await Post.findByIdAndDelete(id);
    return deletedPost;
};
const getPostsByCommunity = async (id) => {
    const posts = await Post.find({ community: id });
    return posts;
};



//comments functions
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
    const comments = await Comment.find({ post: id });
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



//communities functions
const createCommunity = async (community) => {
    const newCommunity = new Community(community);
    await newCommunity.save();
    return newCommunity;
};

const getCommunity = async (id) => {
    const community = await Community.findById(id);
    return community;
};
const getCommunities = async () => {
    const communities = await Community.find();
    return communities;
};
const getCommunitiesByUser = async (id) => {
    const communities = await Community.find({ members: id });
    return communities;
};

const deleteCommunity = async (id) => {
    const deletedCommunity = await Community.findByIdAndDelete(id);
    return deletedCommunity;
};



module.exports = {
    databaseConnection,
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getusersByCommunity,
    createPost,
    getPost,
    getPosts,
    getPostComments,
    getPostsByUser,
    updatePost,
    deletePost,
    getPostsByCommunity,
    createComment,
    getComment,
    getcommentreplies,
    getCommentsByUser,
    getCommentsByPost,
    updateComment,
    deleteComment,
    createCommunity,
    getCommunity,
    getCommunities,
    getCommunitiesByUser,
    deleteCommunity
};