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
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // close when click outside
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
        <div className={`notification-card ${read ? "read" : "unread"}`}>
            
            <div className="notif-icon">{icon}</div>

            <div className="notif-content">
                <p className="notif-title">{title}</p>
                <p className="notif-message">{message}</p>
                <p className="notif-time">{time}</p>
            </div>

            {/* ACTION ICONS */}
            <div className="notif-actions-icons">

                {/* TRASH ICON */}
                <button className="icon-btn trash-btn" onClick={onDelete}>
                    🗑️
                </button>

                {/* THREE DOTS BUTTON */}
                <div className="dots-wrapper" ref={menuRef}>
                    <button 
                        className="icon-btn dots-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ⋯
                    </button>

                    {menuOpen && (
                        <div className="popup-menu">
                            <button 
                                className="popup-item"
                                onClick={() => {
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
