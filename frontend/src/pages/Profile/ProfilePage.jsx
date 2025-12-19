import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import ProfileMain from "./ProfileMain";
import ProfileTabs from "./ProfileTabs";
import "./Profile.css";

function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get stored user from localStorage
    const storedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        // Use stored user data, or fetch fresh data if needed
        if (storedUser) {
            setUser(storedUser);
            setLoading(false);
        }
    }, [navigate, storedUser]);

    if (loading) {
        return <div className="profile-page">Loading...</div>;
    }

    if (!user) {
        return <div className="profile-page">Please log in to view your profile</div>;
    }

    return (
        <div className="profile-page">
            <ProfileHeader user={user} />
            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <ProfileMain activeTab={activeTab} userId={user._id || user.id} />
        </div>
    );
}

export default ProfilePage;