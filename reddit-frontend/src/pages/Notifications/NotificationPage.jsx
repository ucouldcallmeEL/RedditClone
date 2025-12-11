import { Link , useNavigate } from "react-router-dom";

import { useEffect , useState } from "react";
import {    getNotifications ,
            getUnreadNotifications , 
            markAllRead , 
            markOneRead , 
            deleteNotification , 
            clearAllNotifications 
} from "../../services/notificationService";

import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import "./notifications.css";

function NotificationPage() {



    const navigate = useNavigate();

    const [notifications , setNotifications] = useState([]);
    const USER_ID = "692764a74d46fe169b1cab3d";//Replace With Real Signed In User Later
    
    
    useEffect(() => {
        const fetchNotifications = async() => {
            try {
                const res = await getNotifications(USER_ID);
                setNotifications(res.data || []);
                console.log("Hello From Fetch")
            } catch (err) {
                console.error("Failed To Fetch Notifications" , err);
            }
        };
        fetchNotifications();
    }, []);

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
