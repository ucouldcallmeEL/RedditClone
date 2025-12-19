import {
  ArrowBigDown,
  ArrowBigUp,
  EyeOff,
  MessageCircle,
  Share2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { Post } from '../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dompurify types may not be installed
import DOMPurify from 'dompurify';

type Props = {
  post: Post;
  onClick?: () => void;
};

function PostCard({ post, onClick }: Props) {
  const safeBody = post.body ? DOMPurify.sanitize(post.body) : '';
  const mediaEntry = post.mediaUrls?.[0];
  const mediaUrl = mediaEntry?.url || post.media;
  return (
    <article className="post card" ref={containerRef} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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

      {/* AI summary button in the top-right of the card */}
      <div
        className="ai-summary-trigger"
        onMouseEnter={() => {
          setVisible(true);
          fetchSummary();
        }}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => {
          setVisible(true);
          fetchSummary();
        }}
        onBlur={() => setVisible(false)}
        role="button"
        aria-label="Show AI summary"
        tabIndex={0}
      >
        <span className="ai-gradient-text">AI</span>
        {visible && (
          <div className="ai-summary-popup" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {loading && <div>Loading summary…</div>}
            {!loading && <div>{summary ?? 'Hover to generate summary'}</div>}
          </div>
        )}
      </div>

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
          <button aria-label="Upvote">
            <ArrowBigUp size={18} />
          </button>
          <span>{post.upvotes.toLocaleString()}</span>
          <button aria-label="Downvote">
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

