const mongoose = require('mongoose');
const User = require('./schemas/user');
const Post = require('./schemas/post');
const Comment = require('./schemas/comment');
const Community = require('./schemas/community');

uri="mongodb+srv://22p0210:lab9ip@mycoursesdb.udcgumx.mongodb.net/myCoursesDB?retryWrites=true&w=majority"
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
    const post = await Post.findById(id).populate('author', 'name');
    return post;
};

const getPosts = async () => {
    const posts = await Post.find().populate('author', 'name');
    return posts;
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

const getHomePosts = async (userId) => {
    const user = await User.findById(userId);
    const following = user.following;
    const posts = await Post.find({ author: { $in: following } }).populate('author', 'name');
    return posts;
};

const getPopularPosts = async (timeFilter = 'all') => {
    let dateFilter = {};
    
    // Calculate date threshold based on time filter
    if (timeFilter !== 'all') {
        const now = new Date();
        let daysAgo;
        
        switch(timeFilter) {
            case 'today':
                daysAgo = 1;
                break;
            case 'week':
                daysAgo = 7;
                break;
            case 'month':
                daysAgo = 30;
                break;
            default:
                daysAgo = null;
        }
        
        if (daysAgo) {
            const threshold = new Date(now.setDate(now.getDate() - daysAgo));
            dateFilter = { createdAt: { $gte: threshold } };
        }
    }
    
    // Fetch posts and calculate score
    const posts = await Post.find(dateFilter);
    
    // Calculate net score and sort by popularity
    const postsWithScore = posts.map(post => ({
        ...post.toObject(),
        score: post.upvotes - post.downvotes
    })).filter(post => post.score > 0) // Only show posts with positive score
      .sort((a, b) => b.score - a.score); // Sort by score descending
    
    return postsWithScore;
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

const getCommunityByName = async (name) => {
    const community = await Community.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    }).populate({
        path: 'posts',
        populate: {
            path: 'author',
            select: 'name'
        }
    }).populate('moderators', 'name').populate('members', 'name');
    return community;
};

const getPostsByCommunityName = async (communityName) => {
    const community = await Community.findOne({ name: communityName }).populate({
        path: 'posts',
        populate: {
            path: 'author',
            select: 'name'
        }
    });
    if (!community) return [];
    return community.posts;
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
    getHomePosts,
    getPopularPosts,
    getPostsByUser,
    updatePost,
    deletePost,
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
    deleteCommunity,
    getCommunityByName,
    getPostsByCommunityName
};