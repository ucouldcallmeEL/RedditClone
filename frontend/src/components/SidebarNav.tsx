import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Accessibility,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  Home,
  Languages,
  Layers,
  ListIcon,
  Megaphone,
  Newspaper,
  PlusIcon,
  ScrollText,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Info,
  Mail,
  Settings,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
const items = [
  { label: 'Home', icon: Home },
  { label: 'Popular', icon: Flame },
  { label: 'Answers', icon: Layers },
  { label: 'Explore', icon: Compass },
  { label: 'All', icon: ListIcon },
  { label: 'Start a community', icon: PlusIcon },
];

type SidebarLink = {
  label: string;
  icon: LucideIcon;
  badge?: string;
  path?: string;
};

const communityPlaceholders: SidebarLink[] = [
  { label: 'r/webdev', icon: Code2 },
  { label: 'r/reactjs', icon: Layers },
  { label: 'r/frontend', icon: Flame },
  { label: 'r/learnprogramming', icon: ListIcon },
];

const resourcesLinks: SidebarLink[] = [
  { label: 'About Reddit', icon: Info },
  { label: 'Advertise', icon: Megaphone },
  { label: 'Developer Platform', icon: Code2 },
  { label: 'Reddit Pro', icon: ShieldCheck, badge: 'BETA' },
  { label: 'Help', icon: HelpCircle },
  { label: 'Blog', icon: BookOpen },
  { label: 'Careers', icon: Briefcase },
  { label: 'Press', icon: Newspaper },
];

const discoverLinks: SidebarLink[] = [
  { label: 'Communities', icon: Users },
  { label: 'Best of Reddit', icon: Star },
  { label: 'Best of Reddit in Portuguese', icon: Languages },
  { label: 'Best of Reddit in German', icon: Globe },
];

const policyLinks: SidebarLink[] = [
  { label: 'Reddit Rules', icon: ScrollText },
  { label: 'Privacy Policy', icon: Shield },
  { label: 'User Agreement', icon: FileText },
  { label: 'Accessibility', icon: Accessibility },
];

const moderationLinks: SidebarLink[] = [
  { label: 'Mod Queue', icon: Shield, path: '/moderation/queue' },
  { label: 'Mod Mail', icon: Mail, path: '/moderation/mail' },
  { label: 'Mod Management', icon: Settings, path: '/moderation/management' },
];

const moderationSection = { id: 'moderation', title: 'Moderation', items: moderationLinks };

const collapsibleSections = [
  { id: 'communities', title: 'Communities', items: [] },
  { id: 'resources', title: 'Resources', items: resourcesLinks },
  { id: 'discover', title: 'More from Reddit', items: discoverLinks },
  { id: 'policies', title: 'Policies', items: policyLinks },
];

type FeedFilter = 'home' | 'popular' | 'all';

type Props = {
  activeFilter?: FeedFilter;
  onSelectFilter?: (filter: FeedFilter) => void;
};

function SidebarNav({ activeFilter = 'home', onSelectFilter }: Props) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userCommunities, setUserCommunities] = useState<SidebarLink[] | null>(null);
  const [isModerator, setIsModerator] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      console.log("SidebarNav user from localStorage:", user);
      return !!user.isModerator;
    } catch {
      return false;
    }
  });

  const allSections = isModerator ? [moderationSection, ...collapsibleSections] : collapsibleSections;

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const sections = collapsibleSections.reduce(
      (acc, section) => {
        acc[section.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    // Initialize moderation section as well
    sections['moderation'] = false;
    return sections;
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsModerator(!!user.isModerator);
        } catch {
          setIsModerator(false);
        }
      } else {
        setIsModerator(false);
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const width = collapsed ? '80px' : '260px';
    root.style.setProperty('--sidebar-width', width);

    return () => {
      root.style.setProperty('--sidebar-width', '260px');
    };
  }, [collapsed]);

  // load current user's communities (top 3) to show in the Communities section
  useEffect(() => {

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

    const load = async () => {
      try {
        const currentUser = getCurrentUserFromStorage();
        if (currentUser && currentUser.id) {
          // Use `/r/user/...` so apiClient rewrites to the communities route
          const res = await apiClient.get(`/r/user/${currentUser.id}/top3communities`);
          const top: any[] = res.data || [];
          const mapped = top.map((c) => ({ label: `r/${c.name}`, icon: Users }));
          setUserCommunities(mapped);
          return;
        }
        // No current user — show no user-specific communities
        setUserCommunities([]);
      } catch (e) {
        setUserCommunities([]);
      }
    };

    void load();
  }, []);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <button
        type="button"
        className="sidebar__toggle"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="sidebar__section">
        <nav>
          {items.map(({ label, icon: Icon }) => {
            const isFilterItem = ['Home', 'Popular', 'All'].includes(label);
            const isCreateCommunity = label === 'Start a community';

            const handleClick = () => {
              if (isCreateCommunity) {
                navigate('/r/create');
                return;
              }

              if (!onSelectFilter || !isFilterItem) {
                return;
              }

              if (label === 'Home') {
                onSelectFilter('home');
                navigate('/');
              } else if (label === 'Popular') {
                onSelectFilter('popular');
              } else if (label === 'All') {
                onSelectFilter('all');
              }
            };

            const isActive =
              (label === 'Home' && activeFilter === 'home') ||
              (label === 'Popular' && activeFilter === 'popular') ||
              (label === 'All' && activeFilter === 'all');

            return (
              <button
                key={label}
                className={`sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                type="button"
                onClick={handleClick}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {allSections.map(({ id, title, items: sectionItems }) => {
        const isCollapsed = collapsedSections[id];

        return (
          <div
            key={id}
            className={`sidebar__section sidebar__section--collapsible${isCollapsed ? ' sidebar__section--collapsed' : ''
              }`}
          >
            <button
              type="button"
              className="sidebar__section-header"
              onClick={() => toggleSection(id)}
              aria-expanded={!isCollapsed}
              aria-controls={`sidebar-section-${id}`}
            >
              <span>{title}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>

            <div
              id={`sidebar-section-${id}`}
              className="sidebar__section-body"
              hidden={isCollapsed}
            >
              {id === 'communities' && userCommunities && userCommunities.length > 0
                ? userCommunities.map(({ label, icon: Icon }) => {
                  // Extract community name from "r/communityname" format
                  const slug = label.replace(/^r\//i, '');
                  // Use /r/:communityName route format
                  const communityRoute = label.startsWith('r/') ? `/r/${slug}` : `#${label}`;
                  return (
                    <Link key={label} className="sidebar__link" to={communityRoute}>
                      <Icon size={18} />
                      <span>{label}</span>
                    </Link>
                  );
                })
                : sectionItems.map(({ label, icon: Icon, badge, path }) => {
                  let to;
                  if (path) {
                    to = path;
                  } else if (label === 'Communities') {
                    to = '/communities';
                  } else {
                    const slug = label.replace(/^r\//i, '');
                    to = `/community/${slug}`;
                  }

                  return (
                    <Link key={label} className="sidebar__link" to={to}>
                      <Icon size={18} />
                      <span>{label}</span>
                      {badge && <span className="sidebar__badge">{badge}</span>}
                    </Link>
                  );
                })}
            </div>
          </div>
        );
      })
      }
    </aside >
  );
}

export default SidebarNav;

