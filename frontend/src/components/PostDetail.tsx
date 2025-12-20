import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dompurify types may not be installed
import DOMPurify from 'dompurify';
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowLeft,
  EyeOff,
  MessageCircle,
  Share2,
} from 'lucide-react';
import Comment from './Comment';
import { apiClient } from '../services/apiClient';
import type { Comment as CommentType } from '../types';
import { API_BASE_URL } from '../services/config';

const API_BASE = API_BASE_URL;

type PostDetailData = {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  } | null;
  community?: {
    _id: string;
    name: string;
  } | null;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  media?: string;
  mediaUrls?: {
    url: string;
    mediaType?: string;
  }[];
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
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'best' | 'top' | 'new'>('best');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/posts/${postId}`);
      const data = res?.data || {};
      setPost(data.post || data);
      setComments(data.comments || []);
      setCommentCount(data.commentCount || 0);
      setUserVote(typeof data.userVote === 'number' ? data.userVote : 0);
      const refreshed = data.post || data;
      if (refreshed) {
        setUpvotes(refreshed.upvotes || 0);
        setDownvotes(refreshed.downvotes || 0);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (vote: 1 | -1) => {
    try {
      // toggle
      const newVote = userVote === vote ? 0 : vote;
      const res = await apiClient.post(`/posts/vote/${postId}`, { vote: newVote });
      const payload = res?.data || {};
      const updated = payload.post || payload;
      const returnedUserVote = typeof payload.userVote === 'number' ? payload.userVote : newVote;
      if (updated) {
        setUpvotes(updated.upvotes || 0);
        setDownvotes(updated.downvotes || 0);
      }
      setUserVote(returnedUserVote as 1 | -1 | 0);
    } catch (e) {
      console.error('Vote failed', e);
    }
  };

 

  const handleSubmitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !post) return;
    setSubmittingComment(true);
    setCommentError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE}/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content: trimmed })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to add comment');
      }
      const data = await res.json();
      const created = data.comment;
      setComments((prev) => [created, ...prev]);
      setCommentCount((prev) => prev + 1);
      setNewComment('');
    } catch (err) {
      console.error('Comment submit failed', err);
      setCommentError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const addReplyToTree = (items: CommentType[], parentId: string, reply: CommentType): CommentType[] => {
    return items.map((c) => {
      if (c._id === parentId) {
        return {
          ...c,
          replies: [reply, ...(c.replies || [])],
        };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyToTree(c.replies, parentId, reply) };
      }
      return c;
    });
  };

  const handleSubmitReply = async (parentCommentId: string, content: string) => {
    if (!post) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE}/posts/${post._id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ content: trimmed, parentComment: parentCommentId })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to add reply');
    }
    const data = await res.json();
    const created = data.comment;
    setComments((prev) => addReplyToTree(prev, parentCommentId, created));
    setCommentCount((prev) => prev + 1);
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
        </button>
        <div className="error">{error || 'Post not found'}</div>
      </div>
    );
  }

  const score = (upvotes || (post?.upvotes || 0)) - (downvotes || (post?.downvotes || 0));
  const safeContent = post.content ? DOMPurify.sanitize(post.content) : '';
  const mediaItems = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : post.media ? [{ url: post.media }] : [];
  const communityIcon = (post as any)?.community?.profilePicture;
  const authorAvatar = (post as any)?.author?.profilePicture;
  const fallbackAvatar = "/resources/6yyqvx1f5bu71.webp";
  const avatarSrc = communityIcon || authorAvatar || fallbackAvatar;

  return (
    <div className="post-detail">
      <button className="btn btn--ghost back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      <article className="post-detail__post card">
        <div className="post-detail__content">
          <header className="post__meta">
            <img
              src={avatarSrc}
              alt={`${post.community?.name ? `r/${post.community.name}` : `u/${post.author?.username || 'anonymous'}`} icon`}
              className="post__avatar"
              loading="lazy"
            />
            <div>
              <div className="post__subreddit">
                <span>{post.community?.name ? `r/${post.community.name}` : `u/${post.author?.username || 'anonymous'}`}</span>
              </div>
              <p className="post__author">
                Posted by u/{post.author?.username || 'anonymous'} · {getTimeAgo(post.createdAt)}
              </p>
            </div>
          </header>

          <div className="post__content post-detail__content-body">
            <div className="post-detail__title-row">
              <h2 className="post-detail__title">{post.title}</h2>
            </div>
            
            {post.content && (
              <div
                className="post-detail__body"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            )}

            {post.isSpoiler && (
              <div className="post__spoiler">
                <EyeOff size={20} />
                <span>View spoiler</span>
              </div>
            )}

            {mediaItems.length > 0 && (
              <div className="post__media-wrapper">
                <div className="post__media-list">
                  {mediaItems.map((m, idx) =>
                    m.mediaType === 'video' ? (
                      <video key={idx} src={m.url} controls className="post__media-item" />
                    ) : (
                      <img key={idx} src={m.url} alt={post.title} loading="lazy" className="post__media-item" />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="post__actions">
            <div className="vote">
              <button
                aria-label="Upvote"
                onClick={() => handleVote(1)}
                style={{ color: userVote === 1 ? 'orange' : 'inherit' }}
              >
                <ArrowBigUp size={18} />
              </button>
              <span>{score.toLocaleString()}</span>
              <button
                aria-label="Downvote"
                onClick={() => handleVote(-1)}
                style={{ color: userVote === -1 ? 'orange' : 'inherit' }}
              >
                <ArrowBigDown size={18} />
              </button>
            </div>

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
              <button
                className="btn btn--primary"
                onClick={handleSubmitComment}
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? 'Posting...' : 'Comment'}
              </button>
            </div>
            {commentError && <div className="error">{commentError}</div>}
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
              
              <Comment
                key={comment._id}
                comment={comment}
                onReplySubmit={handleSubmitReply}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;

