
import { ArrowBigDown, ArrowBigUp, EyeOff, MessageCircle, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import type { Post } from '../types';
import { apiClient } from '../services/apiClient';

type Props = {
  post: Post;
  onClick?: () => void;
  onVote?: (postId: string, upvotes: number, downvotes: number) => void; // optional callback to update parent
};

function PostCard({ post, onClick, onVote }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0); // 1 up, -1 down, 0 none
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const safeBody = post.body ? DOMPurify.sanitize(post.body) : '';
  const mediaEntry = post.mediaUrls?.[0];
  const mediaUrl = mediaEntry?.url || post.media;

  const getCurrentUserFromStorage = () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))));
          const id = payload?.userId || payload?.sub || null;
          if (storedUser) {
            const u = JSON.parse(storedUser);
            return { id, name: u?.name || u?.username || null, username: u?.username || u?.name || null };
          }
          return { id, name: null, username: null };
        }
      }
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return { id: u?._id || u?.id || null, name: u?.name || u?.username || null, username: u?.username || u?.name || null };
      }
    } catch (e) {
      console.warn('Failed to read current user from storage', e);
    }
    return null;
  };

  const handleVote = async (vote: 1 | -1) => {
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser || !currentUser.id) {
      alert('Please log in to vote');
      return;
    }

    const newVote = userVote === vote ? 0 : vote; // toggle or set

    try {
      const res = await apiClient.post(`/posts/vote/${post.id}`, { vote: newVote });
      const updatedPost = res.data;
      setUpvotes(updatedPost.upvotes);
      setDownvotes(updatedPost.downvotes);
      setUserVote(newVote);
      onVote?.(post.id, updatedPost.upvotes, updatedPost.downvotes);
    } catch (err: any) {
      console.error('Vote failed', err);
      alert('Failed to vote');
    }
  };

  useEffect(() => {
    // hide tooltip on outside click
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const fetchSummary = async () => {
    if (summary || loading) return;
    setLoading(true);
    try {
      const res = await apiClient.post(`/api/ai/summarize/${post.id}`);
      setSummary(res?.data?.summary || 'No summary available');
    } catch (err) {
      console.error('Summary fetch error', err);
      setSummary('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="post card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <header className="post__meta">
        <img
          src={post.communityIcon}
          alt={`${post.subreddit} icon`}
          className="post__avatar"
          loading="lazy"
        />
        <div>
          <div className="post__subreddit">
            <span>{post.subreddit}</span>
            {post.flair && <span className="flair">{post.flair}</span>}
          </div>
          <p className="post__author">
            Posted by {post.author} · {post.createdAt}
          </p>
        </div>
      </header>

      <div className="post__content">
        <h2>{post.title}</h2>
        {post.body && (
          <div
            className="post__body"
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        )}

        {post.isSpoiler && (
          <div className="post__spoiler">
            <EyeOff size={20} />
            <span>View spoiler</span>
          </div>
        )}

        {mediaUrl && (
          <div className="post__media">
            {mediaEntry?.mediaType === 'video' ? (
              <video src={mediaUrl} className="post__media-item" controls />
            ) : (
              <img src={mediaUrl} alt={post.title} loading="lazy" className="post__media-item" />
            )}
          </div>
        )}

        {post.tags && (
          <div className="chips">
            {post.tags.map((tag) => (
              <span key={tag} className="chip chip--ghost">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <footer className="post__actions">
        <div className="vote">
          <button 
            aria-label="Upvote" 
            onClick={(e) => { e.stopPropagation(); handleVote(1); }}
            style={{ color: userVote === 1 ? 'orange' : 'inherit' }}
          >
            <ArrowBigUp size={18} />
          </button>
          <span>{upvotes.toLocaleString()}</span>
          <button 
            aria-label="Downvote" 
            onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
            style={{ color: userVote === -1 ? 'blue' : 'inherit' }}
          >
            <ArrowBigDown size={18} />
          </button>
        </div>

        <button className="ghost-btn">
          <MessageCircle size={16} />
          {post.comments} Comments
        </button>
        <button className="ghost-btn">
          <Share2 size={16} />
          Share
        </button>
      </footer>
    </article>
  );
}

export default PostCard;

