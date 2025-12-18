import SidebarCard from '../components/SidebarCard';
import type { CommunityDetails } from '../types';
import { Calendar, Globe, ChevronDown } from 'lucide-react';

type Props = {
  community: CommunityDetails;
  isModerator?: boolean;
  onInviteModerator?: (username: string) => Promise<void> | void;
};

function CommunitySidebar({ community, isModerator, onInviteModerator }: Props) {
  return (
    <aside className="community-sidebar">
      <SidebarCard>
        <div className="community-info">
          <h2 style={{ margin: 0 }}>{community.name}</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>{community.description}</p>

          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.75rem', alignItems: 'center', color: '#94a3b8' }}>
            <Calendar size={14} />
            <small>Created {community.createdAt}</small>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
              <Globe size={14} />
              <small>Public</small>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>{community.members}</p>
              <small style={{ color: '#94a3b8' }}>Members</small>
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>{community.weeklyContributions ?? '—'}</p>
              <small style={{ color: '#94a3b8' }}>Weekly contributions</small>
            </div>
          </div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eef2f7' }} />

        <div className="community-bookmarks">
          <div className="section-heading">
            <h3>Community bookmarks</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {(community.bookmarks ?? []).map((b, i) => (
              <button key={b + i} className="chip chip--ghost" style={{ width: '100%', textAlign: 'left', padding: '.6rem 1rem', borderRadius: '999px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{b}</span>
                {b.toLowerCase().includes('recent') || b.toLowerCase().includes('official') ? <ChevronDown size={14} /> : null}
              </button>
            ))}
          </div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eef2f7' }} />

        <div className="community-moderators">
          <div className="section-heading" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h3 style={{ margin: 0 }}>Moderators</h3>
            {/** Invite button only visible to moderators */}
            {isModerator ? (
              <button
                className="chip chip--ghost"
                style={{ marginLeft: 'auto' }}
                onClick={async () => {
                  try {
                    const username = prompt('Enter username to invite as moderator (without u/):');
                    if (!username) return;
                    await onInviteModerator?.(username.trim());
                  } catch (e) {
                    console.warn('Invite failed', e);
                  }
                }}
              >
                Invite
              </button>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.6rem' }}>
            {(community.moderators ?? []).map((m, idx) => (
              <div key={(m as string) + idx} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div style={{ fontWeight: 700 }}>{m}</div>
                <small style={{ color: '#94a3b8' }}>Moderator</small>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eef2f7' }} />

        <div className="community-rules">
          <div className="section-heading">
            <h3>{community.name} rules</h3>
          </div>

          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {community.rules?.map((r) => (
              <li key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem' }}>
                <div className="rule-number">{r.id}</div>
                <div style={{ flex: 1 }}>
                  <p className="rule-title">{r.title}</p>
                  {r.description ? <small className="rule-desc">{r.description}</small> : null}
                </div>
                <button className="ghost-btn" aria-label="Expand rule"><ChevronDown size={16} /></button>
              </li>
            ))}
          </ol>
        </div>
      </SidebarCard>
    </aside>
  );
}

export default CommunitySidebar;
