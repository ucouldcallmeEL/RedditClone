import { Link } from "react-router-dom";

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

    // const notifications = [
    //     {
    //         icon: "🛡️",
    //         title: "Because you joined r/fut",
    //         message: "EA already killing TOTY",
    //         time: "13m"
    //     },
    //     {
    //         icon: "🔥",
    //         title: "You're rolling now!",
    //         message: "Getting started is the hardest part. Can you get to a 3-day streak?",
    //         time: "1d"
    //     }
    // ];

    const [notifications , setNotifications] = useState([]);
    const USER_ID = "692764a74d46fe169b1cab3d";//Replace With Real Signed In User Later
    
    
    useEffect(() => {
        const fetchUnread = async() => {
            try {
                const res = await getUnreadNotifications(USER_ID);
                setNotifications(res.data || []);
                console.log("Hello From Fetch")
            } catch (err) {
                console.error("Failed To Fetch Unread Notifications" , err);
            }
        };
        fetchUnread();
    }, []);


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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationPage;
