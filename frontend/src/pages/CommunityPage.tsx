import { useEffect, useMemo, useState } from 'react';
import '../styles/community.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import CommunityHeader from '../components/CommunityHeader';
import CommunitySidebar from '../components/CommunitySidebar';
import PostCard from '../components/PostCard';
import type { CommunityDetails, Post } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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

function ViewDropdown({ compact, onChange }: { compact: boolean; onChange: (c: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const options = [
    { key: false, label: 'Card', icon: <LayoutGrid size={16} /> },
    { key: true, label: 'Compact', icon: <List size={16} /> },
  ];

  return (
    <div className="sort-dropdown" style={{ position: 'relative' }}>
      <button className="chip chip--ghost" onClick={() => setOpen((s) => !s)} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        {compact ? <List size={14} /> : <LayoutGrid size={14} />}
        <span style={{ marginLeft: 2 }}>{compact ? 'Compact' : 'Card'}</span>
        <ChevronDown size={14} style={{ marginLeft: 6 }} />
      </button>

      {open ? (
        <div className="sort-menu card" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, minWidth: 160, zIndex: 40 }}>
          <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid #eef2f7', fontWeight: 700 }}>View</div>
          {options.map((o) => (
            <button
              key={String(o.key)}
              className={`profile-menu__item`}
              onClick={() => {
                onChange(o.key as boolean);
                setOpen(false);
              }}
            >
              <span style={{ width: 28, display: 'inline-flex', justifyContent: 'center' }}>{o.icon}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CommunityPage() {
  const { communityName } = useParams<{ communityName: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityName) return;

    setLoading(true);
    fetch(`http://localhost:3000/r/${communityName}`)
      .then((res) => res.json())
      .then((communityData: any) => {
        // Set community details
        const communityDetails: CommunityDetails = {
          name: `r/${communityData.name}`,
          members: `${communityData.members?.length || 0} members`,
          description: communityData.description,
          avatar: communityData.profilePicture,
          bannerColor: '#f97316',
          bannerImage: communityData.coverPicture,
          createdAt: new Date(communityData.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          moderators: communityData.moderators?.map((mod: any) => `u/${mod.name}`) || [],
          rules: [
            { id: '1', title: 'Be respectful' },
            { id: '2', title: 'No spam' },
            { id: '3', title: 'Follow Reddit rules' },
          ],
          bookmarks: ['Wiki', 'Recent Game Threads'],
          weeklyContributions: '1.5K',
          online: 432,
          joined: false,
        };
        setCommunity(communityDetails);

        // Set posts
        const postsData = communityData.posts?.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          author: post.author.name,
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          comments: post.comments?.length || 0,
          subreddit: `r/${communityName}`,
          createdAt: post.createdAt,
          communityIcon: 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
          timeAgo: '2h ago',
        })) || [];
        setPosts(postsData);
      })
      .catch((err) => {
        console.error('Failed to fetch community data', err);
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
    <main className={`feed ${theme === 'dark' ? 'community-theme' : ''}`}>
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
            <ViewDropdown compact={compactView} onChange={(c) => setCompactView(c)} />
            {/* post count removed as requested */}
          </div>
        </div>
        <div>
          <section className="card">
            {/* Posts heading removed per request */}

            {loading ? (
              <p>Loading…</p>
            ) : displayedPosts.length ? (
              displayedPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
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

        <div style={{ alignSelf: 'start' }}>
          {community && <CommunitySidebar community={community} />}
        </div>
      </div>
    </main>
  );
}

export default CommunityPage;
