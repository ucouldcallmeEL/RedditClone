import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import "./notifications.css";

function NotificationPage() {

    const notifications = [
        {
            icon: "🛡️",
            title: "Because you joined r/fut",
            message: "EA already killing TOTY",
            time: "13m"
        },
        {
            icon: "🔥",
            title: "You're rolling now!",
            message: "Getting started is the hardest part. Can you get to a 3-day streak?",
            time: "1d"
        }
    ];

    return (
        <div className="notifications-container">

            <div className="notifications-header">
                <h1>Notifications</h1>
            </div>

            {notifications.length > 0 && (

                <div className="notif-actions">
                    <button className="notif-btn">Mark all as read</button>
                    <span className="notif-divider">|</span>
                    <button className="notif-icon-btn">🗑️</button>
                    <span className="notif-divider">|</span>
                    <button className="notif-icon-btn">⚙️</button>
                </div>
            )}


            {/* If no notifications → show empty message */}
            {notifications.length === 0 ? (
                <EmptyNotifications />
            ) : (
                <div className="not-cont">
                    {notifications.map((n, i) => (
                        <NotificationCard
                            key={i}
                            icon={n.icon}
                            title={n.title}
                            message={n.message}
                            time={n.time}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationPage;
