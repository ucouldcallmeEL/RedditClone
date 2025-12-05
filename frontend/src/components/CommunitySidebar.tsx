import SidebarCard from './SidebarCard';
import type { CommunityDetails } from '../types';
import { Pencil, Calendar, Globe, ChevronDown } from 'lucide-react';

type Props = {
  community: CommunityDetails;
};

function CommunitySidebar({ community }: Props) {
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
      </SidebarCard>

      <SidebarCard title="Community bookmarks">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {(community.bookmarks ?? []).map((b, i) => (
            <button key={b + i} className="chip chip--ghost" style={{ width: '100%', textAlign: 'left', padding: '.6rem 1rem', borderRadius: '999px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{b}</span>
              {b.toLowerCase().includes('recent') || b.toLowerCase().includes('official') ? <ChevronDown size={14} /> : null}
            </button>
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title={`${community.name} rules`}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {community.rules?.map((r) => (
            <li key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem' }}>
              <div className="chip" style={{ width: 36, height: 28, display: 'grid', placeItems: 'center' }}>{r.id}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{r.title}</p>
                {r.description ? <small style={{ color: '#94a3b8' }}>{r.description}</small> : null}
              </div>
              <button className="ghost-btn" aria-label="Expand rule"><ChevronDown size={16} /></button>
            </li>
          ))}
        </ol>
      </SidebarCard>
    </aside>
  );
}

export default CommunitySidebar;
