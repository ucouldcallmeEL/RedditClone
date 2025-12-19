const Post = require('../schemas/post');
const User = require('../schemas/user');
const Vote = require('../schemas/vote');

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

const votePost = async (postId, userId, voteType) => {
    // voteType: 1 for upvote, -1 for downvote, 0 to remove vote
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    const existingVote = await Vote.findOne({ user: userId, post: postId });

    if (voteType === 0) {
        // Remove vote
        if (existingVote) {
            if (existingVote.vote === 1) {
                post.upvotes -= 1;
            } else if (existingVote.vote === -1) {
                post.downvotes -= 1;
            }
            await Vote.findByIdAndDelete(existingVote._id);
            await post.save();
        }
        return post;
    }

    if (existingVote) {
        // Change vote
        if (existingVote.vote === voteType) {
            // Same vote, remove it
            if (voteType === 1) {
                post.upvotes -= 1;
            } else {
                post.downvotes -= 1;
            }
            await Vote.findByIdAndDelete(existingVote._id);
        } else {
            // Change vote
            if (existingVote.vote === 1) {
                post.upvotes -= 1;
                post.downvotes += 1;
            } else {
                post.upvotes += 1;
                post.downvotes -= 1;
            }
            existingVote.vote = voteType;
            await existingVote.save();
        }
    } else {
        // New vote
        if (voteType === 1) {
            post.upvotes += 1;
        } else {
            post.downvotes += 1;
        }
        const newVote = new Vote({ user: userId, post: postId, vote: voteType });
        await newVote.save();
    }

    await post.save();
    return post;
};

module.exports = {
    createPost,
    getPost,
    getPosts,
    getHomePosts,
    getPopularPosts,
    getPostsByUser,
    updatePost,
    deletePost,
    votePost
};