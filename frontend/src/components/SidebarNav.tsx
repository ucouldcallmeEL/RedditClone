import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

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

const collapsibleSections = [
  { id: 'communities', title: 'Communities', items: communityPlaceholders },
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
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() =>
    collapsibleSections.reduce(
      (acc, section) => {
        acc[section.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

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

            const handleClick = () => {
              if (!onSelectFilter || !isFilterItem) {
                return;
              }

              if (label === 'Home') {
                onSelectFilter('home');
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

      {collapsibleSections.map(({ id, title, items: sectionItems }) => {
        const isCollapsed = collapsedSections[id];

        return (
          <div
            key={id}
            className={`sidebar__section sidebar__section--collapsible${
              isCollapsed ? ' sidebar__section--collapsed' : ''
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
              {sectionItems.map(({ label, icon: Icon, badge }) => {
                const slug = label.replace(/^r\//i, '');
                return (
                  <Link key={label} className="sidebar__link" to={`/community/${slug}`}>
                    <Icon size={18} />
                    <span>{label}</span>
                    {badge && <span className="sidebar__badge">{badge}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
}

export default SidebarNav;

