import { useEffect, useState } from 'react';
import '../styles/community.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import CommunityHeader from '../components/CommunityHeader';
import CommunitySidebar from './CommunitySidebar';
import PostCard from '../components/PostCard';
import type { CommunityDetails, Post } from '../types';
import { useTheme } from '../contexts/ThemeContext';

import { apiClient } from '../services/apiClient';
//import { CreatePostButton, ModToolsButton, JoinLeaveButton } from '../components/CommunityButtons';

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
  const [isModerator, setIsModerator] = useState(false);

  const getCurrentUserFromStorage = () => {
    // Prefer JWT token (stored as `token`) and decode payload for userId
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))));
          const id = payload?.userId || payload?.sub || null;
          // try to fill name/username from stored user object if available
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

  useEffect(() => {
    if (!communityName) return;

    const loadCommunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/r/${communityName}`, { params: { filter } });
        const communityData = res.data;

        const currentUser = getCurrentUserFromStorage();

        let isJoined = false;
        if (currentUser && communityData.members?.length) {
          isJoined = communityData.members.some((m: any) => {
            if (!m) return false;
            if (typeof m === 'string') return m === currentUser.name || m === currentUser.username;
            return m.name === currentUser.name || m.name === currentUser.username || m._id === currentUser.id;
          });
        }

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

        // Determine moderator status client-side from populated moderators list
        try {
          let isModLocal = false;
          if (currentUser && communityData.moderators?.length) {
            isModLocal = communityData.moderators.some((m: any) => {
              if (!m) return false;
              if (typeof m === 'string') {
                // stored as a name string
                return (
                  m === currentUser.name ||
                  m === currentUser.username ||
                  m === currentUser.id ||
                  m === `u/${currentUser.username}` ||
                  m === `u/${currentUser.name}`
                );
              }
              const mid = String(m._id || m.id || '');
              const mname = m.name || m.username || '';
              return mid === String(currentUser.id) || mname === currentUser.username || mname === currentUser.name;
            });
          }
          setIsModerator(!!isModLocal);
        } catch (e) {
          console.warn('Failed to determine moderator status locally', e);
          setIsModerator(false);
        }

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
        })) || [];
        setPosts(postsData);
      } catch (err: any) {
        console.error('Failed to fetch community data', err?.response || err.message || err);
        setError(err?.response?.data?.error || err.message || 'Failed to load community');
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
    (window as any).__loadCommunity = loadCommunity;
  }, [communityName, filter]);

  const handleInviteModerator = async (username: string) => {
    if (!communityName || !username) return;
    try {
      const communityId = community?.id || null;
      await apiClient.post(`/r/${communityName}/invite-mod`, { username, communityId });
    } catch (err) {
      console.warn('Failed to invite moderator', err);
    }

    try {
      if (typeof (window as any).__loadCommunity === 'function') {
        await (window as any).__loadCommunity();
      }
    } catch (e) {
      console.warn('Failed to reload after invite', e);
    }
  };

  const handleToggleJoin = async (joined: boolean) => {
    if (!communityName) return;
    // if the user is leaving, hide mod tools immediately for better UX
    if (!joined) setIsModerator(false);
    try {
      const currentUser = getCurrentUserFromStorage();
      const userId = currentUser?.id || currentUser?.username || currentUser?.name || null;
      const communityId = community?.id || null;

      if (!userId) {
        console.warn('join/leave: no userId available, aborting');
        return;
      }

      if (joined) {
        await apiClient.post(`/r/${communityName}/join`, { userId, communityId });
      } else {
        await apiClient.post(`/r/${communityName}/leave`, { userId, communityId });
      }
    } catch (err: any) {
      // Log detailed error information to help debug 500s
      console.warn('join/leave API call failed', err?.message || err);
      if (err?.response) {
        console.warn('Response status:', err.response.status);
        console.warn('Response data:', err.response.data);
        console.warn('Response headers:', err.response.headers);
      } else if (err?.request) {
        console.warn('No response received, request:', err.request);
      }
    }
    // refresh moderator state immediately (ensure mod tools hide promptly)
    // then reload community details (loadCommunity will recompute moderator state)
    try {
      if (typeof (window as any).__loadCommunity === 'function') {
        await (window as any).__loadCommunity();
      }
    } catch (e) {
      console.warn('Failed to reload community after join/leave', e);
    }
  };

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
          isModerator={isModerator}
          onOpenModTools={() => navigate(`/r/${communityName}/mod-tools`)}
          onToggleJoin={(joined) => {
            void handleToggleJoin(joined);
          }}
        />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / span 2', marginTop: '.5rem' }}>
          <div className="filter-bar" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <SortDropdown active={filter} onChange={(f) => setFilter(f)} />
            <ViewDropdown compact={compactView} onChange={(c) => setCompactView(c)} />
          </div>
        </div>
        <div>
          <section className="card">
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
          {community && (
            <CommunitySidebar community={community} isModerator={isModerator} onInviteModerator={handleInviteModerator} />
          )}
        </div>
      </div>
    </main>
  );
}

export default CommunityPage;
