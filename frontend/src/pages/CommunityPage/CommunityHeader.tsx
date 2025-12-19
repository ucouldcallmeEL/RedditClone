import { useState, useEffect } from 'react';
import type { CommunityDetails } from '../../types';
import { CreatePostButton, ModToolsButton, JoinLeaveButton } from './CommunityButtons';
import { Edit3 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

type Props = {
  community: CommunityDetails;
  onToggleJoin?: (joined: boolean) => void;
  isModerator?: boolean;
  onOpenModTools?: () => void;
};

function CommunityHeader({ community, onToggleJoin, isModerator, onOpenModTools }: Props) {
  const [joined, setJoined] = useState<boolean>(!!community.joined);

  // keep internal joined state in sync when parent updates community.joined
  useEffect(() => {
    setJoined(!!community.joined);
  }, [community.joined]);

  const toggle = () => {
    setJoined((v) => {
      const nv = !v;
      onToggleJoin?.(nv);
      return nv;
    });
  };

  const getCurrentUserFromStorage = () => {
    return { id: '69397d04292782398b5f6821', name: 'yehia', username: 'test_user' };
  };

  const communityNameShort = community.name?.replace(/^r\//, '') || '';

  const uploadImage = async (type: 'avatar' | 'cover', file: File | null) => {
    if (!file) return;
    try {
      const currentUser = getCurrentUserFromStorage();
      const form = new FormData();
      form.append('image', file);
      form.append('type', type);
      form.append('userId', currentUser.id);

      await apiClient.post(`/r/${communityNameShort}/upload-image`, form, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (typeof (window as any).__loadCommunity === 'function') {
        await (window as any).__loadCommunity();
      }
    } catch (e) {
      console.warn('Failed to upload image', e);
    }
  };

  return (
    <section className="card community-header" style={{ padding: 0, overflow: 'visible' }}>
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
        {isModerator ? (
          <label className="edit-overlay" style={{ position: 'relative', top: -120, right: 12, display: 'inline-block', float: 'right', margin: 8 }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadImage('cover', e.target.files?.[0] ?? null)} />
            <div className="chip chip--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Edit3 size={14} />
            </div>
          </label>
        ) : null}

      <div className="community-header__body" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
        <div style={{ position: 'relative' }}>
          <div className="community-header__avatar" style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', marginTop: -48, zIndex: 2 }}>
            <img src={community.avatar} alt={community.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {isModerator ? (
            <label className="edit-overlay" style={{ position: 'absolute', bottom: -8, right: -8, zIndex: 5 }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadImage('avatar', e.target.files?.[0] ?? null)} />
              <div className="chip chip--ghost" style={{ borderRadius: '999px', padding: '.3rem .4rem', display: 'inline-flex', alignItems: 'center' }}>
                <Edit3 size={14} />
              </div>
            </label>
          ) : null}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{community.name}</h1>
          <p style={{ margin: 0, color: '#64748b' }}>{community.members}</p>
        </div>

        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <CreatePostButton onClick={() => { /* placeholder: open composer */ }} />

          {isModerator ? <ModToolsButton onClick={() => onOpenModTools?.()} /> : null}

          <JoinLeaveButton joined={joined} onClick={toggle} />
        </div>
      </div>

      {/* header rules removed — rules are shown in the sidebar now */}
    </section>
  );
}

export default CommunityHeader;
