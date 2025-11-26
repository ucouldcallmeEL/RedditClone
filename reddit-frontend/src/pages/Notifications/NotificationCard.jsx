import "./notifications.css";

function NotificationCard({ icon, title, message, time }) {
    return (
        <div className="notification-card">
            <div className="notif-icon">{icon}</div>

            <div className="notif-content">
                <p className="notif-title">{title}</p>
                <p className="notif-message">{message}</p>
                <p className="notif-time">{time}</p>
            </div>
        </div>
    );
}

export default NotificationCard;
