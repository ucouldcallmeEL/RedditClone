// ...existing code...
const { getPost, createPost, votePost } = require('../managers/postManager');
const { getCommentsByPost } = require('../managers/commentManager');
const Vote = require('../schemas/vote');

const getPostDetails = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await getPost(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    const comments = await getCommentsByPost(postId);
    const commentMap = {};
    const topLevelComments = [];
    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment.toObject(), replies: [] };
    });
    comments.forEach(comment => {
      if (comment.parentComment) {
        if (commentMap[comment.parentComment]) {
          commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
        }
      } else {
        topLevelComments.push(commentMap[comment._id]);
      }
    });

    // include current user's vote (if authenticated)
    let userVote = 0;
    try {
      const userId = req.user && req.user._id;
      if (userId) {
        const voteDoc = await Vote.findOne({ user: userId, post: postId }).lean();
        userVote = voteDoc ? voteDoc.vote : 0;
      }
    } catch (e) {
      userVote = 0;
    }

    res.send({
      post,
      comments: topLevelComments,
      commentCount: comments.length,
      userVote
    });
  } catch (err) {
    console.error('Failed to fetch post details', err);
    res.status(500).send({ error: 'Failed to fetch post details' });
  }
};

// Create a new post
const addPost = async (req, res) => {
  try {
    // Get authenticated user from token (set by authenticate middleware)
    const userId = req.user._id;

    // Add author to post data
    const postData = {
      ...req.body,
      author: userId,
    };

    const newPost = await createPost(postData);
    // return populated/augmented post (with vote counts)
    const fullPost = await getPost(newPost._id);
    res.status(201).json(fullPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ error: err.message });
  }
};

const voteOnPost = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const { vote } = req.body; // 1, -1, or 0
    const userId = req.user._id;

    console.log(`[voteOnPost] user=${userId} post=${id} vote=${vote}`);

    if (![1, -1, 0].includes(vote)) {
      return res.status(400).send({ error: 'Invalid vote value' });
    }

    const updatedPost = await votePost(id, userId, vote);

    // reflect current user's vote after the change
    const voteDoc = await Vote.findOne({ user: userId, post: id }).lean();
    const userVote = voteDoc ? voteDoc.vote : 0;

    res.send({ post: updatedPost, userVote });
  } catch (err) {
    console.error('Failed to vote on post', err);
    res.status(500).send({ error: err.message || 'Failed to vote on post' });
  }
};

module.exports = {
  getPostDetails,
  addPost,
  voteOnPost,
};
// ...existing code...