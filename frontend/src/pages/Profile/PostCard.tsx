import {
  ArrowBigDown,
  ArrowBigUp,
  EyeOff,
  MessageCircle,
  Share2,
} from 'lucide-react';
import type { Post } from '../types';
import { useEffect, useState, useRef } from 'react';
import { apiClient } from '../../services/apiClient';

import "./PostCard.css"

type Props = {
  post: Post;
  onClick?: () => void;
};

function PostCard({ post, onClick }: Props) {
  const [userVote, setUserVote] = useState<1 | -1 | 0>((post as any)?.userVote || 0);
  const [upvotes, setUpvotes] = useState<number>(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState<number>(post.downvotes || 0);

  const _initPostId = useRef<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const id = (post as any)._id || (post as any).id;
        const res = await apiClient.get(`/posts/${id}`);
        const data = res?.data || {};
        if (cancelled) return;
        const p = data.post || data;
        setUpvotes(p?.upvotes || 0);
        setDownvotes(p?.downvotes || 0);
        setUserVote(typeof data.userVote === 'number' ? data.userVote : 0);
        _initPostId.current = id;
      } catch (e) {
        // ignore
      }
    }
    const currentId = (post as any)._id || (post as any).id;
    if (_initPostId.current !== currentId) refresh();
    return () => { cancelled = true; };
  }, [post]);

  const handleVote = async (vote: 1 | -1) => {
    try {
      const id = (post as any)._id || (post as any).id;
      const newVote = userVote === vote ? 0 : vote;
      const res = await apiClient.post(`/posts/vote/${id}`, { vote: newVote });
      const payload = res?.data || {};
      const updated = payload.post || payload;
      setUpvotes(updated?.upvotes || 0);
      setDownvotes(updated?.downvotes || 0);
      setUserVote(typeof payload.userVote === 'number' ? payload.userVote : newVote);
    } catch (e) {
      console.error('Vote failed', e);
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
        {post.body && <p>{post.body}</p>}

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
          <button aria-label="Upvote" onClick={() => handleVote(1)} style={{ color: userVote === 1 ? 'orange' : 'inherit' }}>
            <ArrowBigUp size={18} />
          </button>
          <span>{(upvotes - downvotes).toLocaleString()}</span>
          <button aria-label="Downvote" onClick={() => handleVote(-1)} style={{ color: userVote === -1 ? 'orange' : 'inherit' }}>
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