import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';
import type { Post } from '../types';

function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/r/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const backendPosts = await response.json();
      
      // Transform backend data to frontend format
      const transformedPosts: Post[] = backendPosts.map((post: any) => ({
        id: post._id,
        subreddit: 'r/general',
        communityIcon: 'https://styles.redditmedia.com/t5_2qh4c/styles/communityIcon_ddkrl1wbp3t91.png',
        title: post.title,
        body: post.content,
        upvotes: post.upvotes || 0,
        comments: post.comments?.length || 0,
        shared: 0,
        author: post.author?.name ? `u/${post.author.name}` : 'u/anonymous',
        createdAt: getTimeAgo(post.createdAt),
      }));
      
      setPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'recently';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'recently';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Handle future dates or negative differences
    if (diffMs < 0) return 'just now';
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <>
      <PostComposer />
      {loading ? (
        <div className="loading card">Loading posts...</div>
      ) : error ? (
        <div className="error card">
          {error}
          <button className="btn btn--primary" onClick={fetchPosts} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No posts yet. Be the first to create one!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onClick={() => handlePostClick(post.id)}
          />
        ))
      )}
    </>
  );
}

export default HomePage;

