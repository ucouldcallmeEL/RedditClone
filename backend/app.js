const express = require('express');
const { databaseConnection, getHomePosts, getPosts, getPopularPosts, getPost, getCommentsByPost, getCommunityByName, getPostsByCommunityName } = require('./DBmanager');

const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.get('/r/all', async (req, res) => {
  try {
    const posts = await getPosts();
    res.send(posts);
  } catch (err) {
    console.error('Failed to fetch all posts', err);
    res.status(500).send({ error: 'Failed to fetch posts' });
  }
});

app.get('/r/popular', async (req, res) => {
  try {
    // Get time filter from query params: today, week, month, or all (default)
    const timeFilter = req.query.time || 'all';
    
    // Validate time filter
    const validFilters = ['today', 'week', 'month', 'all'];
    if (!validFilters.includes(timeFilter)) {
      return res.status(400).send({ 
        error: 'Invalid time filter. Use: today, week, month, or all' 
      });
    }
    
    const posts = await getPopularPosts(timeFilter);
    res.send({
      posts: posts,
      timeFilter: timeFilter,
      count: posts.length
    });
  } catch (err) {
    console.error('Failed to fetch popular posts', err);
    res.status(500).send({ error: 'Failed to fetch popular posts' });
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Get the post details
    const post = await getPost(postId);
    
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    
    // Get all comments for this post
    const comments = await getCommentsByPost(postId);
    
    // Organize comments into a tree structure (parent-child relationships)
    const commentMap = {};
    const topLevelComments = [];
    
    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment.toObject(), replies: [] };
    });
    
    // Second pass: build the tree structure
    comments.forEach(comment => {
      if (comment.parentComment) {
        // This is a reply, add it to its parent's replies
        if (commentMap[comment.parentComment]) {
          commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
        }
      } else {
        // This is a top-level comment
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
});

app.get('/r/:communityName', async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const community = await getCommunityByName(communityName);
    
    if (!community) {
      return res.status(404).send({ error: 'Community not found' });
    }
    
    res.send(community);
  } catch (err) {
    console.error('Failed to fetch community details', err);
    res.status(500).send({ error: 'Failed to fetch community details' });
  }
});

app.get('/', async (req, res) => {
  // Allow upstream modules/middleware to set the logged-in user id on req
  const userId =
    req.user?.id || req.userId || req.query.userId || req.body?.userId;

  if (!userId) {
    try {
      const posts = await getPosts();
      return res.send({
        posts: posts,
        warning: 'No userId provided. Showing all posts instead of personalized feed.',
        isPersonalized: false
      });
    } catch (err) {
      console.error('Failed to fetch posts', err);
      return res.status(500).send({ error: 'Failed to fetch posts' });
    }
  }
  try {
    const posts = await getHomePosts(userId);
    res.send({
      posts: posts,
      isPersonalized: true
    });
  } catch (err) {
    console.error('Failed to fetch home posts', err);
    res.status(500).send({ error: 'Failed to fetch home posts' });
  }
});


databaseConnection()
  .then(() => {
    console.log('Connection OK');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Connection Error', err);
    process.exit(1);
  });