import { useEffect, useMemo, useState } from 'react';
import '../styles/community.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import CommunityHeader from '../components/CommunityHeader';
import CommunitySidebar from '../components/CommunitySidebar';
import PostCard from '../components/PostCard';
import { fetchCommunityDetails, fetchCommunityPosts } from '../utils/community';
import type { CommunityDetails, Post } from '../types';
import { posts as allPosts } from '../data/feed';

type FilterKey = 'hot' | 'new' | 'top' | 'rising';

function SortDropdown({ active, onChange }: { active: FilterKey; onChange: (f: FilterKey) => void }) {
  const options: { key: FilterKey; label: string }[] = [
    { key: 'hot', label: 'Best' },
    { key: 'new', label: 'New' },
    { key: 'top', label: 'Top' },
    { key: 'rising', label: 'Rising' },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="sort-dropdown" style={{ position: 'relative' }}>
      <button className="chip chip--ghost" onClick={() => setOpen((s) => !s)}>
        {options.find((o) => o.key === active)?.label}
        <ChevronDown size={14} style={{ marginLeft: 6 }} />
      </button>

      {open ? (
        <div className="sort-menu card" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, minWidth: 160, zIndex: 40 }}>
          {options.map((o) => (
            <button
              key={o.key}
              className={`profile-menu__item`} // reuse simple item style
              onClick={() => {
                onChange(o.key);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ViewToggle({ compact, onChange }: { compact: boolean; onChange: (c: boolean) => void }) {
  return (
    <div className="view-toggle" style={{ display: 'flex', gap: '.4rem' }}>
      <button className={`ghost-btn ${!compact ? 'active-filter' : ''}`} onClick={() => onChange(false)} aria-pressed={!compact}>
        <LayoutGrid size={14} />
      </button>
      <button className={`ghost-btn ${compact ? 'active-filter' : ''}`} onClick={() => onChange(true)} aria-pressed={compact}>
        <List size={14} />
      </button>
    </div>
  );
}

function CommunityPage() {
  const { communityName } = useParams<{ communityName: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityName) return;

    setLoading(true);
    Promise.all([fetchCommunityDetails(communityName), fetchCommunityPosts(communityName)])
      .then(([c, p]) => {
        setCommunity(c);
        // If no posts exist in feed for this community, fabricate example posts
        if (p.length) {
          setPosts(p);
        } else {
          const examples = allPosts.slice(0, 2).map((ep) => ({
            ...ep,
            id: `example-${ep.id}`,
            subreddit: `r/${communityName}`,
            communityIcon: ep.communityIcon,
          }));
          setPosts(examples);
        }
      })
      .finally(() => setLoading(false));
  }, [communityName]);

  // add a root class while this page is mounted so we can adjust layout widths
  useEffect(() => {
    const cls = 'community-active';
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);

  const [filter, setFilter] = useState<FilterKey>('hot');
  const [compactView, setCompactView] = useState(false);

  const displayedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [] as Post[];

    switch (filter) {
      case 'hot':
        return [...posts].sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments));
      case 'new':
        // we don't have a real date, keep original order
        return posts;
      case 'top':
        return [...posts].sort((a, b) => b.upvotes - a.upvotes);
      case 'rising':
        return [...posts].sort((a, b) => a.comments - b.comments);
      default:
        return posts;
    }
  }, [posts, filter]);

  if (!communityName) return <main className="feed">No community specified</main>;

  return (
    <main className="feed">
      {community && (
        <CommunityHeader
          community={community}
          onToggleJoin={(joined) => setCommunity((c) => (c ? { ...c, joined } : c))}
        />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        {/* Sort & view toolbar */}
        <div style={{ gridColumn: '1 / span 2', marginTop: '.5rem' }}>
          <div className="filter-bar" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <SortDropdown active={filter} onChange={(f) => setFilter(f)} />
            <ViewToggle compact={compactView} onChange={(c) => setCompactView(c)} />
            <div style={{ marginLeft: 'auto', color: '#94a3b8' }}>{posts.length.toLocaleString()} posts</div>
          </div>
        </div>
        <div>
          <section className="card">
            <div className="section-heading">
              <h3>Posts</h3>
            </div>

            {loading ? (
              <p>Loading…</p>
            ) : displayedPosts.length ? (
              displayedPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/community/${communityName}/post/${post.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <PostCard post={post} />
                </article>
              ))
            ) : (
              <p>No posts yet. Be the first to post!</p>
            )}
          </section>
        </div>

        <div>
          {community && <CommunitySidebar community={community} />}
        </div>
      </div>
    </main>
  );
}

export default CommunityPage;
