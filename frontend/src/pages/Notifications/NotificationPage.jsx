import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect , useState } from "react";
import {
    getNotifications,
    getUnreadNotifications,
    markAllRead,
    markOneRead,
    deleteNotification,
    clearAllNotifications,
} from "../../../services/notificationService";
import { API_BASE_URL } from "../../../services/config";

import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import "./notifications.css";

function NotificationPage() {



    const navigate = useNavigate();
    const location = useLocation();

    const [notifications , setNotifications] = useState([]);
    const [error, setError] = useState(null);

    // Allow testing via URL: /notifications?userId=<mongoUserId>
    // Fallback is placeholder until auth/storage is implemented.
    const params = new URLSearchParams(location.search);
    const rawUserId = params.get("userId") || "6934495b29dbd06fab20e7e9";

    // Accept formats like:
    // - 69344c82629a24cf1dd72b0
    // - ObjectId('69344c82629a24cf1dd72b0')
    const USER_ID = (rawUserId.match(/[a-f0-9]{24}/i)?.[0]) || rawUserId;
    
    
    useEffect(() => {
        const fetchNotifications = async() => {
            try {
                setError(null);
                const res = await getNotifications(USER_ID);
                setNotifications(res.data || []);
                console.log("Hello From Fetch")
            } catch (err) {
                console.error("Failed To Fetch Notifications" , err);
                const status = err?.response?.status;
                const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
                const msg = err?.message || "Unknown error";
                setError(
                    `Failed to fetch notifications from ${API_BASE_URL}/api/notifications/${USER_ID}. ` +
                    `${status ? `HTTP ${status}. ` : ""}` +
                    `${serverMsg ? `Server: ${serverMsg}. ` : ""}` +
                    `Client: ${msg}`
                );
            }
        };
        fetchNotifications();
    }, [USER_ID]);

    const handleMarkAllRead = async () => {
        try {
            await markAllRead(USER_ID);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const goToNotificationSettings = () => {
        navigate("/settings?tab=notifications");
    }

    const handleDeleteNotification = async (notifId) => {
        try {
            await deleteNotification(notifId)
            setNotifications(prev => prev.filter(n => n._id !== notifId));
        } catch (err) {
            console.error("Failed to delete notification" , err)
        }
    }


    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h1>Notifications</h1>
            </div>

            {error && (
                <div style={{ margin: "12px 0", padding: "10px 12px", background: "#fee2e2", color: "#991b1b", borderRadius: 8 }}>
                    {error}
                </div>
            )}

            {notifications.length > 0 && (

                <div className="notif-actions">
                    <button className="notif-btn" onClick={handleMarkAllRead}>Mark all as read</button>
                    <span className="notif-divider">|</span>
                    <button className="notif-icon-btn">🗑️</button>
                    <span className="notif-divider">|</span>
                    <Link to="/settings?tab=notifications"><button className="notif-icon-btn">⚙️</button></Link>
                </div>
            )}


            {/* If no notifications → show empty message */}
            {notifications.length === 0 ? (
                <EmptyNotifications />
            ) : (
                <div className="not-cont">
                    {notifications.map((n) => (
                        <NotificationCard
                            key={n._id}
                            icon={"🔔"}
                            title={n.type}
                            message={n.message}
                            time={new Date(n.createdAt).toLocaleString()}
                            read={n.isRead}
                            onDelete={() => handleDeleteNotification(n._id)}
                            onManage={goToNotificationSettings}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationPage;
