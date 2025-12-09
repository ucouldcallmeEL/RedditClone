import {
  ArrowBigDown,
  ArrowBigUp,
  EyeOff,
  MessageCircle,
  Share2,
} from 'lucide-react';
import type { Post } from '../types';

type Props = {
  post: Post;
  onClick?: () => void;
};

function PostCard({ post, onClick }: Props) {
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

