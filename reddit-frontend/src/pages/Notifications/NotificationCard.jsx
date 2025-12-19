import { useState, useRef, useEffect } from "react";
import "./notifications.css";

function NotificationCard({
  icon,
  title,
  message,
  time,
  read,
  onDelete,
  onManage,
  onOpen,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`notification-card ${read ? "read" : "unread"}`}
      onClick={onOpen}
    >
      <div className="notif-icon">
        <img
          src={icon}
          alt="sender avatar"
          className="notif-avatar"
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      </div>

      <div className="notif-content">
        <p className="notif-title">{title}</p>
        <p className="notif-message">{message}</p>
        <p className="notif-time">{time}</p>
      </div>

      <div className="notif-actions-icons" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn trash-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>

        <div
          className="dots-wrapper"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="icon-btn dots-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="popup-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="popup-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onManage();
                }}
              >
                Manage notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
