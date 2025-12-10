import { useState, useEffect } from 'react';
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowLeft,
  EyeOff,
  MessageCircle,
  Share2,
} from 'lucide-react';
import Comment from './Comment';
import type { Comment as CommentType } from '../types';

type PostDetailData = {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: string;
  media?: string;
  isSpoiler?: boolean;
};

type Props = {
  postId: string;
  onBack: () => void;
};

function PostDetail({ postId, onBack }: Props) {
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'best' | 'top' | 'new'>('best');

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/post/${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      setPost(data.post);
      setComments(data.comments);
      setCommentCount(data.commentCount);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
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

  if (loading) {
    return (
      <div className="post-detail">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail">
        <button className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="error">{error || 'Post not found'}</div>
      </div>
    );
  }

  const score = post.upvotes - post.downvotes;

  return (
    <div className="post-detail">
      <button className="btn btn--ghost back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Back
      </button>

      <article className="post-detail__post card">
        <div className="post-detail__vote">
          <button aria-label="Upvote">
            <ArrowBigUp size={24} />
          </button>
          <span className="post-detail__score">{score.toLocaleString()}</span>
          <button aria-label="Downvote">
            <ArrowBigDown size={24} />
          </button>
        </div>

        <div className="post-detail__content">
          <header className="post__meta">
            <div>
              <p className="post__author">
                Posted by u/{post.author.name} · {getTimeAgo(post.createdAt)}
              </p>
            </div>
          </header>

          <h1 className="post-detail__title">{post.title}</h1>
          
          {post.content && <p className="post-detail__body">{post.content}</p>}

          {post.isSpoiler && (
            <div className="post__spoiler">
              <EyeOff size={20} />
              <span>View spoiler</span>
            </div>
          )}

          {post.media && (
            <div className="post__media">
              <img src={post.media} alt={post.title} loading="lazy" />
            </div>
          )}

          <footer className="post__actions">
            <button className="ghost-btn">
              <MessageCircle size={16} />
              {commentCount} Comments
            </button>
            <button className="ghost-btn">
              <Share2 size={16} />
              Share
            </button>
          </footer>
        </div>
      </article>

      <div className="comments-section card">
        <div className="comments-section__header">
          <div className="comments-section__composer">
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="comments-section__composer-actions">
              <button className="btn btn--primary">Comment</button>
            </div>
          </div>
        </div>

        <div className="comments-section__sort">
          <span>Sort by:</span>
          <button 
            className={sortBy === 'best' ? 'active' : ''}
            onClick={() => setSortBy('best')}
          >
            Best
          </button>
          <button 
            className={sortBy === 'top' ? 'active' : ''}
            onClick={() => setSortBy('top')}
          >
            Top
          </button>
          <button 
            className={sortBy === 'new' ? 'active' : ''}
            onClick={() => setSortBy('new')}
          >
            New
          </button>
        </div>

        <div className="comments-section__list">
          {comments.length === 0 ? (
            <div className="comments-section__empty">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;

