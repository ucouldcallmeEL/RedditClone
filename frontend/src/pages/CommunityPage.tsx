import { useEffect, useState } from 'react';
import '../styles/community.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import CommunityHeader from '../components/CommunityHeader';
import CommunitySidebar from '../components/CommunitySidebar';
import PostCard from '../components/PostCard';
import type { CommunityDetails, Post } from '../types';
import { useTheme } from '../contexts/ThemeContext';

import { apiClient } from '../../services/apiClient';

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
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('hot');
  const [compactView, setCompactView] = useState(false);

const getCurrentUserFromStorage = () => {
  // fetchhhhhhhhhhhhhhhhhhhhhhhhhh current userrrrrrrrrrrrr dataaaaa from token or sessionnor wtvr
  return { 
    id: "69397d04292782398b5f6821", 
    name: "yehia", 
    username: "test_user" 
  };
};

  useEffect(() => {
    if (!communityName) return;

    const loadCommunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/r/${communityName}`, { params: { filter } });
        const communityData = res.data;

        const currentUser = getCurrentUserFromStorage();

        // Determine whether the current user is a member
        let isJoined = false;
        if (currentUser && communityData.members?.length) {
          isJoined = communityData.members.some((m: any) => {
            if (!m) return false;
            if (typeof m === 'string') return m === currentUser.name || m === currentUser.username;
            return m.name === currentUser.name || m.name === currentUser.username || m._id === currentUser.id;
          });
        }

        // Set community details from authoritative backend data (member count sourced from DB)
        const communityDetails: CommunityDetails = {
          name: `r/${communityData.name}`,
          id: communityData._id,
          members: `${communityData.members?.length || 0} members`,
          description: communityData.description,
          avatar: communityData.profilePicture,
          bannerColor: communityData.bannerColor || '#f97316',
          bannerImage: communityData.coverPicture,
          createdAt: communityData.createdAt
            ? new Date(communityData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : '',
          moderators: communityData.moderators?.map((mod: any) => `u/${mod.name}`) || [],
          rules: communityData.rules || [
            { id: '1', title: 'Be respectful' },
            { id: '2', title: 'No spam' },
            { id: '3', title: 'Follow Reddit rules' },
          ],
          joined: isJoined,
        };
        setCommunity(communityDetails);

        // Map posts
        const postsData = communityData.posts?.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          author: post.author?.name ? `u/${post.author.name}` : 'u/anonymous',
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          comments: post.comments?.length || 0,
          subreddit: `r/${communityName}`,
          createdAt: post.createdAt,
          communityIcon: communityData.profilePicture || 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
          // timeAgo: '2h ago',
        })) || [];
        setPosts(postsData);
      } catch (err: any) {
        console.error('Failed to fetch community data', err?.response || err.message || err);
        setError(err?.response?.data?.error || err.message || 'Failed to load community');
      } finally {
        setLoading(false);
      }
    };

    // initial load
    loadCommunity();

    // expose loader for onToggleJoin
    (window as any).__loadCommunity = loadCommunity;
  }, [communityName, filter]);

  // helper to toggle membership via backend and then reload authoritative data
  const handleToggleJoin = async (joined: boolean) => {
    if (!communityName) return;
    try {
      // attempt backend update; endpoints may be added later — fail gracefully
      const currentUser = getCurrentUserFromStorage();
      const userId = currentUser?.id || currentUser?.name || null;
      const communityId = community?.id || null;

      if (joined) {
        await apiClient.post(`/r/${communityName}/join`, { userId, communityId });
      } else {
        await apiClient.post(`/r/${communityName}/leave`, { userId, communityId });
      }
    } catch (err) {
      // ignore errors — we'll refresh anyway to get authoritative count when available
      console.warn('join/leave API call failed', err);
    }

    // reload community details from backend (member count comes from DB)
    try {
      if (typeof (window as any).__loadCommunity === 'function') {
        await (window as any).__loadCommunity();
      }
    } catch (e) {
      console.warn('Failed to reload community after join/leave', e);
    }
  };


  // add a root class while this page is mounted so we can adjust layout widths
  useEffect(() => {
    const cls = 'community-active';
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);

  if (!communityName) return <main className="feed">No community specified</main>;

  return (
    <main className={`feed ${theme === 'dark' ? 'community-theme' : ''}`}>
      {community && (
        <CommunityHeader
          community={community}
          onToggleJoin={(joined) => {
            // call backend then reload authoritative data
            void handleToggleJoin(joined);
          }}
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
            ) : error ? (
              <p>Error: {error}</p>
            ) : posts.length ? (
              posts.map((post) => (
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
