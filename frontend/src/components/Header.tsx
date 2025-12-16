import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Crown,
  LogOut,
  MessageCircle,
  Moon,
  Pencil,
  ScrollText,
  Search,
  Coins,
  Star,
  Trophy,
  User,
  LayoutGrid,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import redditLogo from '../../../resources/Reddit_Lockup.svg';

const profileActions = [
  { label: 'Edit Avatar', icon: Pencil },
  { label: 'Drafts', icon: ScrollText },
  { label: 'Achievements', icon: Trophy, meta: '4 unlocked' },
  { label: 'Earn', icon: Coins, meta: 'Earn cash on Reddit' },
  { label: 'Premium', icon: Crown },
  { label: 'Dark Mode', icon: Moon, control: 'toggle' },
  { label: 'Log Out', icon: LogOut },
];

const promoActions = [
  { label: 'Advertise on Reddit', icon: Star },
  { label: 'Try Reddit Pro', icon: LayoutGrid, badge: 'BETA' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!triggerRef.current || !triggerRef.current.contains(target))
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleMenuItemClick = (label: string) => {
    if (label === 'Dark Mode') {
      toggleTheme();
    } else if (label === 'Log Out') {
      // Handle logout
      console.log('Logging out...');
    }
    // Add more handlers as needed
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src={redditLogo}
          alt="Reddit logo"
          className="header__logo-img"
          role="button"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="header__search">
        <Search size={16} strokeWidth={2} />
        <input placeholder="Search Reddit" aria-label="Search Reddit" />
      </div>

      <div className="header__actions">
        <button className="icon-btn" aria-label="Messages">
          <MessageCircle size={18} />
        </button>
        <Link className="icon-btn" aria-label="Notifications" to="/notifications">
          <Bell size={18} />
        </Link>
        <div className="profile-menu__trigger" ref={triggerRef}>
          <button
            className="profile"
            aria-label="Account menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <User size={18} />
            <span className="profile__name">u/you</span>
            <ChevronDown size={16} />
          </button>

          <div
            className={`profile-menu${menuOpen ? ' profile-menu--open' : ''}`}
            ref={menuRef}
            role="menu"
          >
            <div className="profile-menu__section profile-menu__section--user">
              <div className="profile-menu__avatar" aria-hidden="true">
                <span>U</span>
              </div>
              <div>
                <p className="profile-menu__username">View Profile</p>
                <p className="profile-menu__handle">u/Majestic_Fox_168</p>
              </div>
            </div>

            <div className="profile-menu__section">
              {profileActions.map(({ label, icon: Icon, meta, control }) => (
                <button 
                  key={label} 
                  className="profile-menu__item"
                  onClick={() => handleMenuItemClick(label)}
                >
                  <Icon size={18} />
                  <div className="profile-menu__item-text">
                    <span>{label}</span>
                    {meta && <small>{meta}</small>}
                  </div>
                  {control === 'toggle' ? (
                    <span 
                      className={`profile-menu__toggle${theme === 'dark' ? ' profile-menu__toggle--active' : ''}`}
                      aria-hidden="true"
                    >
                      <span />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="profile-menu__section">
              {promoActions.map(({ label, icon: Icon, badge }) => (
                <button key={label} className="profile-menu__item">
                  <Icon size={18} />
                  <div className="profile-menu__item-text">
                    <span>{label}</span>
                  </div>
                  {badge && <span className="profile-menu__badge">{badge}</span>}
                </button>
              ))}
            </div>

            <div className="profile-menu__section">
              <button className="profile-menu__item">
                <SettingsIcon size={18} />
                <span className="profile-menu__item-text">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

