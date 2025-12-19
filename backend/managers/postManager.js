const Post = require('../schemas/post');
const User = require('../schemas/user');

const createPost = async (post) => {
    const newPost = new Post(post);
    await newPost.save();
    return newPost;
};

const getPost = async (id) => {
    const post = await Post.findById(id)
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture');
    return post;
};

const getPosts = async () => {
    const posts = await Post.find()
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture');
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
    if (!user) return [];

    const authors = [...user.following, userId];
    const communities = user.communities || [];

    return Post.find({
        $or: [
            { author: { $in: authors } },
            { community: { $in: communities } }
        ]
    })
    .populate('author', 'username profilePicture')
    .populate('community', 'name profilePicture');
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
    const posts = await Post.find(dateFilter)
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture');

    // Calculate net score and sort by popularity
    const postsWithScore = posts.map(post => ({
        ...post.toObject(),
        score: post.upvotes - post.downvotes
    })).filter(post => post.score > 0) // Only show posts with positive score
      .sort((a, b) => b.score - a.score); // Sort by score descending

    return postsWithScore;
};

module.exports = {
    createPost,
    getPost,
    getPosts,
    getHomePosts,
    getPopularPosts,
    getPostsByUser,
    updatePost,
    deletePost
};