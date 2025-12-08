import { useState } from 'react';
import { UserPlus, Check, Plus } from 'lucide-react';
import type { CommunityDetails } from '../types';

type Props = {
  community: CommunityDetails;
  onToggleJoin?: (joined: boolean) => void;
};

function CommunityHeader({ community, onToggleJoin }: Props) {
  const [joined, setJoined] = useState<boolean>(!!community.joined);

  const toggle = () => {
    setJoined((v) => {
      const nv = !v;
      onToggleJoin?.(nv);
      return nv;
    });
  };

  return (
    <section className="card community-header" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        className="subreddit-banner"
        style={{
          backgroundColor: community.bannerColor || '#e8eef6',
          backgroundImage: community.bannerImage ? `url(${community.bannerImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 120,
        }}
        aria-hidden
      />

      <div className="community-header__body" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
        <div className="community-header__avatar" style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', marginTop: -48 }}>
          <img src={community.avatar} alt={community.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{community.name}</h1>
          <p style={{ margin: 0, color: '#64748b' }}>{community.members} • {community.online?.toLocaleString() ?? 0} online</p>
        </div>

        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <button className="chip chip--ghost create-post" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }} onClick={() => { /* placeholder: open composer */ }}>
            <Plus size={14} /> Create Post
          </button>

          <button className={`chip`} onClick={toggle} aria-pressed={joined}>
            {joined ? <><Check size={14} /> Joined</> : <><UserPlus size={14} /> Join</>}
          </button>
        </div>
      </div>

      {/* header rules removed — rules are shown in the sidebar now */}
    </section>
  );
}

export default CommunityHeader;
