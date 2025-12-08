import { Link } from "react-router-dom";

import "./notifications.css";

function EmptyNotifications() {
    return (
        <div className="empty-notifs">
            <img
                src="https://www.redditstatic.com/shreddit/assets/snoovatar-full-hi.png"
                alt="No notifications"
                className="empty-notifs-img"
            />
            <h2>Turn on email digest</h2>
            <p>Stay in the loop on content from communities you love right in your email inbox.</p>
            <Link to="/settings?tab=email"><button className="empty-btn">View settings</button></Link>
        </div>
    );
}

export default EmptyNotifications;
