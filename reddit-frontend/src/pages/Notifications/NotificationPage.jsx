import { Link , useNavigate , useLocation} from "react-router-dom";

import { useEffect , useState , useMemo } from "react";
import {    getNotifications ,
            getUnreadNotifications , 
            markAllRead , 
            markOneRead , 
            deleteNotification , 
            clearAllNotifications 
} from "../../services/notificationService";
import defaultAvatar from "../../assets/Reddit_Avatar.webp";

import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import "./notifications.css";

function NotificationPage() {



    const navigate = useNavigate();
    const location = useLocation();

    const [notifications , setNotifications] = useState([]);

    const storedUser = useMemo(() => {
        try {
        return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
        return null;
        }
    }, []);
    const USER_ID = storedUser?._id || storedUser?.id;

    useEffect(() => {
        if (!USER_ID) {
        navigate("/login", {
            replace: true,
            state: { from: location.pathname + location.search },
        });
        }
    }, [USER_ID, navigate, location]);
    
    
    useEffect(() => {
        if (!USER_ID) return;

        const fetchNotifications = async () => {
        try {
            const res = await getNotifications(USER_ID);
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed To Fetch Notifications", err);
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

    if (!USER_ID) return null;


    return (
        <div className="notifications-container">

            <div className="notifications-header">
                <h1>Notifications</h1>
            </div>

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
                    {notifications.map((n) => {
                        const senderAvatar =
                            n.sender && typeof n.sender === "object"
                            ? n.sender.profilePicture || defaultAvatar
                            : defaultAvatar;

                        return (
                            <NotificationCard
                            key={n._id}
                            icon={senderAvatar}
                            title={n.type}
                            message={n.message}
                            time={new Date(n.createdAt).toLocaleString()}
                            read={n.isRead}
                            onDelete={() => handleDeleteNotification(n._id)}
                            onManage={goToNotificationSettings}
                            />
                        );
                        })}

                </div>
            )}
        </div>
    );
}

export default NotificationPage;
