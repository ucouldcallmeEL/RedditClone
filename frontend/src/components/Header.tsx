import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const redditLogo = "/Reddit_Lockup.svg";

const profileActions = [
  { label: "Edit Avatar", icon: Pencil },
  { label: "Drafts", icon: ScrollText },
  { label: "Achievements", icon: Trophy, meta: "4 unlocked" },
  { label: "Earn", icon: Coins, meta: "Earn cash on Reddit" },
  { label: "Premium", icon: Crown },
  { label: "Dark Mode", icon: Moon, control: "toggle" },
  { label: "Log Out", icon: LogOut },
];

const promoActions = [
  { label: "Advertise on Reddit", icon: Star },
  { label: "Try Reddit Pro", icon: LayoutGrid, badge: "BETA" },
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

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleMenuItemClick = (label: string) => {
    if (label === "Dark Mode") {
      toggleTheme();
    } else if (label === "Log Out") {
      // Handle logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } else if (label === "Settings") {
      navigate("/settings");
    }
    // Add more handlers as needed
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src={redditLogo}
          alt="Reddit logo"
          className="header__logo-img"
          role="button"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="header__search">
        <Search size={16} strokeWidth={2} />
        <input placeholder="Search Reddit" aria-label="Search Reddit" />
      </div>

      <div className="header__actions">
        {/* Create Post Button - only show when user is signed in */}
        {isLoggedIn && (
          <button
            className="header__create-post-btn"
            onClick={() => navigate("/posts/create")}
            style={{
              padding: "0.5rem 1rem",
              color: "var(--text-primary)",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              marginRight: "0.5rem",
              alignItems: "center",
              justifyContent: "center",
              display: "inline-flex",
              gap: "0.5rem",
            }}
          >
            <svg
              fill="currentColor"
              height="20"
              icon-name="add-square"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.7 2H5.3C3.481 2 2 3.48 2 5.3v9.4C2 16.519 3.48 18 5.3 18h9.4c1.819 0 3.3-1.48 3.3-3.3V5.3C18 3.481 16.52 2 14.7 2zm1.499 12.7a1.5 1.5 0 01-1.499 1.499H5.3A1.5 1.5 0 013.801 14.7V5.3A1.5 1.5 0 015.3 3.801h9.4A1.5 1.5 0 0116.199 5.3v9.4zM14 10.9h-3.1V14H9.1v-3.1H6V9.1h3.1V6h1.8v3.1H14v1.8z"></path>
            </svg>
            Create
          </button>
        )}

        {/* Log In Button - show when user is not logged in */}
        {!isLoggedIn && (
          <>
            <button
              className="header__get_app-btn"
              aria-label="Get the Reddit app"
            >
              <svg
                fill="currentColor"
                height="20"
                icon-name="qr-code"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.7 19H14c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h1.7c.83 0 1.5-.67 1.5-1.5V14c0-.5.4-.9.9-.9s.9.4.9.9v1.7c0 1.82-1.48 3.3-3.3 3.3zM19 6V4.3C19 2.48 17.52 1 15.7 1H14c-.5 0-.9.4-.9.9s.4.9.9.9h1.7c.83 0 1.5.67 1.5 1.5V6c0 .5.4.9.9.9s.9-.4.9-.9zM2.8 6V4.3c0-.83.67-1.5 1.5-1.5H6c.5 0 .9-.4.9-.9S6.5 1 6 1H4.3C2.48 1 1 2.48 1 4.3V6c0 .5.4.9.9.9s.9-.4.9-.9zm4.1 12.1c0-.5-.4-.9-.9-.9H4.3c-.83 0-1.5-.67-1.5-1.5V14c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.7C1 17.52 2.48 19 4.3 19H6c.5 0 .9-.4.9-.9zm8.4-10V5.7c0-.55-.45-1-1-1h-2.4c-.55 0-1 .45-1 1v2.4c0 .55.45 1 1 1h2.4c.55 0 1-.45 1-1zm-6.2 0V5.7c0-.55-.45-1-1-1H5.7c-.55 0-1 .45-1 1v2.4c0 .55.45 1 1 1h2.4c.55 0 1-.45 1-1zm0 6.2v-2.4c0-.55-.45-1-1-1H5.7c-.55 0-1 .45-1 1v2.4c0 .55.45 1 1 1h2.4c.55 0 1-.45 1-1zm6.2-.1v-3.3h-1.8v2.6h-2.6v1.8h3.3c.61 0 1.1-.49 1.1-1.1z"></path>
              </svg>
              Get App
            </button>
            <button
              className="header__login-btn"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className="icon-btn ads" aria-label="Advertise on Reddit">
              <svg
                fill="currentColor"
                height="20"
                icon-name="ad-group"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.972 5.028C16.831 3.338 15.426 2 13.7 2H3.3C1.481 2 0 3.48 0 5.3v6.4c0 1.726 1.337 3.131 3.028 3.272C3.169 16.662 4.574 18 6.3 18h10.4c1.819 0 3.3-1.48 3.3-3.3V8.3c0-1.726-1.337-3.131-3.028-3.272zM3 8.3v4.87a1.5 1.5 0 01-1.199-1.47V5.3c0-.827.672-1.5 1.499-1.5h10.4c.724 0 1.33.516 1.469 1.2H6.3C4.481 5 3 6.48 3 8.3zm15.199 6.4c0 .827-.672 1.5-1.499 1.5H6.3a1.501 1.501 0 01-1.499-1.5V8.3c0-.827.672-1.5 1.499-1.5h10.4c.827 0 1.499.673 1.499 1.5v6.4zM9.545 8.741H8.281L6 14.259h1.709l.389-1.009h1.635l.389 1.009h1.707L9.545 8.741zm.067 3.344H8.22l.681-1.793h.027l.684 1.793zm5.937-3.053a3.162 3.162 0 00-1.339-.291h-1.965v5.517h2.053c.458 0 .898-.108 1.307-.32a2.532 2.532 0 001.008-.958c.256-.422.386-.932.386-1.516 0-.596-.137-1.107-.405-1.519a2.48 2.48 0 00-1.046-.914l.001.001zm-.147 2.441c0 .304-.058.557-.171.753a1.097 1.097 0 01-.414.424 1.01 1.01 0 01-.487.136h-.488v-2.569h.488c.163 0 .329.042.496.125.161.081.295.21.407.397.112.184.169.431.169.735v-.001z"></path>
              </svg>
            </button>
            <button className="icon-btn messages" aria-label="Messages">
              <svg
                fill="currentColor"
                height="20"
                icon-name="chat"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2zm5.2-7.2a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
              </svg>
            </button>
            <Link
              className="icon-btn"
              aria-label="Notifications"
              to="/notifications"
            >
              <svg
                fill="currentColor"
                height="20"
                icon-name="notifications"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.176 14.218l-.925-1.929a2.577 2.577 0 01-.25-1.105V8c0-3.86-3.142-7-7-7-3.86 0-7 3.14-7 7v3.184c0 .38-.088.762-.252 1.105l-.927 1.932A1.103 1.103 0 002.82 15.8h3.26A4.007 4.007 0 0010 19a4.008 4.008 0 003.918-3.2h3.26a1.1 1.1 0 00.934-.514 1.1 1.1 0 00.062-1.068h.002zM10 17.2c-.93 0-1.722-.583-2.043-1.4h4.087a2.197 2.197 0 01-2.043 1.4zM3.925 14l.447-.933c.28-.584.43-1.235.43-1.883V8c0-2.867 2.331-5.2 5.198-5.2A5.205 5.205 0 0115.2 8v3.184c0 .648.147 1.299.428 1.883l.447.933H3.925z"></path>
              </svg>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <div className="profile-menu__trigger" ref={triggerRef}>
            <button
              className="profile"
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <img
                src={
                  JSON.parse(localStorage.getItem("user") || "{}")
                    .profilePicture
                }
                alt="User avatar"
                className="profile-menu__avatar"
              />
            </button>

            <div
              className={`profile-menu${menuOpen ? " profile-menu--open" : ""}`}
              ref={menuRef}
              role="menu"
            >
              <div className="profile-menu__section profile-menu__section--user">
                <div className="profile-menu__avatar" aria-hidden="true">
                  <img
                    src={
                      JSON.parse(localStorage.getItem("user") || "{}")
                        .profilePicture
                    }
                    alt="User avatar"
                    className="profile-menu__avatar"
                  />
                </div>
                <div>
                  <p className="profile-menu__username">View Profile</p>
                  <p className="profile-menu__handle">
                    u/
                    {JSON.parse(localStorage.getItem("user") || "{}").username}
                  </p>
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
                    {control === "toggle" ? (
                      <span
                        className={`profile-menu__toggle${
                          theme === "dark"
                            ? " profile-menu__toggle--active"
                            : ""
                        }`}
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
                    {badge && (
                      <span className="profile-menu__badge">{badge}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="profile-menu__section">
                <button
                  className="profile-menu__item"
                  onClick={() => handleMenuItemClick("Settings")}
                >
                  <SettingsIcon size={18} />
                  <span className="profile-menu__item-text">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
