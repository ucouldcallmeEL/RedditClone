// ...existing code...
const Post = require('../schemas/post');
const User = require('../schemas/user');
const Vote = require('../schemas/vote');

const createPost = async (post) => {
    const newPost = new Post(post);
    await newPost.save();
    return newPost;
};

const computeCounts = (post) => {
    const votes = (post.vote && post.vote.length) ? post.vote : [];
    let upvotes = 0, downvotes = 0;
    for (const v of votes) {
        if (!v) continue;
        if (typeof v.vote === 'number') {
            if (v.vote === 1) upvotes++;
            else if (v.vote === -1) downvotes++;
        }
    }
    return { upvotes, downvotes, score: upvotes - downvotes };
};

const getPost = async (id) => {
    const post = await Post.findById(id)
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture')
        .populate('vote'); // populate vote refs
    if (!post) return null;
    const counts = computeCounts(post);
    return { ...post.toObject(), ...counts };
};

const getPosts = async () => {
    const posts = await Post.find()
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture')
        .populate('vote');
    return posts.map(p => ({ ...p.toObject(), ...computeCounts(p) }));
};

const getPostsByUser = async (id) => {
    const posts = await Post.find({ author: id }).populate('vote');
    return posts.map(p => ({ ...p.toObject(), ...computeCounts(p) }));
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

    const posts = await Post.find({
        $or: [
            { author: { $in: authors } },
            { community: { $in: communities } }
        ]
    })
    .populate('author', 'username profilePicture')
    .populate('community', 'name profilePicture')
    .populate('vote');

    return posts.map(p => ({ ...p.toObject(), ...computeCounts(p) }));
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

    // Fetch posts with vote refs populated and calculate score from those refs
    const posts = await Post.find(dateFilter)
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture')
        .populate('vote');

    const postsWithScore = posts.map(post => {
        const obj = post.toObject();
        const counts = computeCounts(post);
        return { ...obj, ...counts };
    }).filter(post => post.score > 0) // Only show posts with positive score
      .sort((a, b) => b.score - a.score); // Sort by score descending

    return postsWithScore;
};

const votePost = async (postId, userId, voteType) => {
    // voteType: 1 for upvote, -1 for downvote, 0 to remove vote
    const post = await Post.findById(postId).populate('vote');
    if (!post) throw new Error('Post not found');

    let existingVote = await Vote.findOne({ user: userId, post: postId });

    if (voteType === 0) {
        // Remove vote
        if (existingVote) {
            // remove vote doc
            await Vote.findByIdAndDelete(existingVote._id);
            // remove ref from post.vote array
            post.vote = post.vote.filter(vId => vId.toString() !== existingVote._id.toString());
            await post.save();
        }
    } else {
        if (existingVote) {
            if (existingVote.vote === voteType) {
                // Same vote: remove it
                await Vote.findByIdAndDelete(existingVote._id);
                post.vote = post.vote.filter(vId => vId.toString() !== existingVote._id.toString());
                await post.save();
            } else {
                // Flip vote: update existing Vote doc (post.vote refs unchanged)
                existingVote.vote = voteType;
                await existingVote.save();
            }
        } else {
            // New vote: create Vote doc and push its ref into post.vote
            const newVote = new Vote({ user: userId, post: postId, vote: voteType });
            await newVote.save();
            post.vote.push(newVote._id);
            await post.save();
        }
    }

    // Re-populate votes to compute counts
    const updatedPost = await Post.findById(postId)
        .populate('author', 'username profilePicture')
        .populate('community', 'name profilePicture')
        .populate('vote');

    const counts = computeCounts(updatedPost);
    return { ...updatedPost.toObject(), ...counts };
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
// ...existing code...