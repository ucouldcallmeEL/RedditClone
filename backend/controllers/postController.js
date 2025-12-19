const { getPost, createPost } = require('../managers/postManager');
const { getCommentsByPost } = require('../managers/commentManager');

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
    res.send({
      post: post,
      comments: topLevelComments,
      commentCount: comments.length
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

    const post = await createPost(postData);
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getPostDetails,
  addPost,
};