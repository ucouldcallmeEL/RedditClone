import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2 } from 'lucide-react';
import type { Comment as CommentType } from '../types';

type Props = {
  comment: CommentType;
  depth?: number;
  onReplySubmit?: (parentCommentId: string, content: string) => Promise<void>;
};

function Comment({ comment, depth = 0, onReplySubmit }: Props) {
  const fallbackAvatar = "/resources/6yyqvx1f5bu71.webp";
  const authorName =  (comment as any)?.author?.username || "anonymous";
  const avatarSrc = (comment as any)?.author?.profilePicture || fallbackAvatar;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  
  const score = comment.upvotes - comment.downvotes;
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  // Calculate time ago
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

  return (
    <div className={`comment ${depth > 0 ? 'comment--nested' : ''}`} style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
      <div className="comment__line" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className={`comment__collapse-line ${isCollapsed ? 'comment__collapse-line--collapsed' : ''}`} />
      </div>
      
      <div className="comment__content">
        <div className="comment__header">
          <img src={avatarSrc} alt={authorName || "author"} className="comment__avatar" loading="lazy" />
          <span className="comment__author-inline">{authorName}</span>
          <span className="comment__meta-inline">{getTimeAgo(comment.createdAt)}</span>
        </div>
        
        {!isCollapsed && (
          <>
            <div className="comment__body">
              <p>{comment.content}</p>
            </div>
            
            <div className="comment__actions">
              <div className="vote vote--small">
                <button aria-label="Upvote">
                  <ArrowBigUp size={16} />
                </button>
                <span>{score}</span>
                <button aria-label="Downvote">
                  <ArrowBigDown size={16} />
                </button>
              </div>
              
              <button 
                className="ghost-btn ghost-btn--small"
                onClick={() => setShowReplyBox(!showReplyBox)}
              >
                <MessageCircle size={14} />
                Reply
              </button>
              
              <button className="ghost-btn ghost-btn--small">
                <Share2 size={14} />
                Share
              </button>
            </div>
            
            {showReplyBox && (
              <div className="comment__reply-box">
                <textarea 
                  placeholder="What are your thoughts?"
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="comment__reply-actions">
                  <button className="btn btn--sm" onClick={() => { setShowReplyBox(false); setReplyError(null); }}>
                    Cancel
                  </button>
                  <button
                    className="btn btn--primary btn--sm"
                    disabled={submitting || !replyText.trim()}
                    onClick={async () => {
                      if (!onReplySubmit) return;
                      const trimmed = replyText.trim();
                      if (!trimmed) return;
                      try {
                        setSubmitting(true);
                        setReplyError(null);
                        await onReplySubmit(comment._id, trimmed);
                        setReplyText('');
                        setShowReplyBox(false);
                      } catch (err) {
                        setReplyError(err instanceof Error ? err.message : 'Failed to reply');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {submitting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
                {replyError && <div className="error">{replyError}</div>}
              </div>
            )}
            
            {hasReplies && (
              <div className="comment__replies">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    onReplySubmit={onReplySubmit}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;

