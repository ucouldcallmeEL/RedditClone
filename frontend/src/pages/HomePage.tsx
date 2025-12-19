import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';
import type { Post } from '../types';

type FeedFilter = 'home' | 'popular' | 'all';

type Props = {
  feedFilter?: FeedFilter;
};

function HomePage({ feedFilter = 'home' }: Props) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(feedFilter);
  }, [feedFilter]);

  const fetchPosts = async (filter: FeedFilter = 'home') => {
    try {
      setLoading(true);

      // Use centralized API routes
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
      const BACKEND_BASE = API_BASE_URL.replace(/\/api$/, '');
      const withBackendBase = (val?: string) =>
        val && val.startsWith('/') ? `${BACKEND_BASE}${val}` : val || '';
      let url = '';

      if (filter === 'all') {
        url = `${API_BASE_URL}/posts`;
      } else if (filter === 'popular') {
        url = `${API_BASE_URL}/posts/popular?filter=all`;
      } else {
        // Home feed - need userId from localStorage
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            url = `${API_BASE_URL}/posts/home/${userData._id || userData.id}`;
          } catch {
            url = `${API_BASE_URL}/posts`;
          }
        } else {
          url = `${API_BASE_URL}/posts`;
        }
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();

      // Normalize shape: /all returns an array, / and /popular return { posts: [...] }
      const backendPosts = Array.isArray(data) ? data : data.posts || [];
      
      // Transform backend data to frontend format
      const transformedPosts: Post[] = backendPosts.map((post: any) => {
        const authorName = post.author?.username || 'anonymous';
        const communityName = post.community?.name;
        const label = communityName ? `r/${communityName}` : `u/${authorName}`;

        const communityIcon =
          withBackendBase(post.community?.profilePicture) ||
          withBackendBase(post.author?.profilePicture) ||
          '';

        const mediaEntry = post.mediaUrls?.[0];
        const mediaUrl = mediaEntry?.url || post.media;

        return {
          id: post._id,
          subreddit: label,
          communityIcon,
          title: post.title,
          body: post.content,
          media: mediaUrl,
          mediaUrls: post.mediaUrls || [],
          upvotes: post.upvotes || 0,
          comments: post.comments?.length || 0,
          shared: 0,
          author: `u/${authorName}`,
          createdAt: getTimeAgo(post.createdAt),
        };
      });
      
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
          <button className="btn btn--primary" onClick={() => fetchPosts(feedFilter)} style={{ marginTop: '1rem' }}>
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

