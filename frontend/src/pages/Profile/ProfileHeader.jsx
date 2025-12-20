import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { userRoutes, apiGet } from "../../config/apiRoutes";
import avatarFallback from "./Reddit_Avatar.webp";

function ProfileHeader({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);

    // Resolve relative profile picture paths against backend base
    const backendBase = useMemo(() => {
        const apiBase = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api$/, "");
        return apiBase;
    }, []);

    const withBackendBase = (val) =>
        val && val.startsWith("/") ? `${backendBase}${val}` : val || "";

    useEffect(() => {
        // If user is provided, use it; otherwise fetch current user
        if (initialUser) {
            setUser(initialUser);
            setLoading(false);
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                const response = await apiGet(userRoutes.getCurrentUser);
                
                if (!response.ok) {
                    console.error("Failed to fetch current user");
                    setLoading(false);
                    return;
                }

                const userData = await response.json();
                setUser(userData);
                // Update localStorage with fresh user data
                localStorage.setItem("user", JSON.stringify(userData));
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [initialUser]);

    if (loading) {
        return (
            <div className="profile-header">
                <div className="profile-content">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-header">
                <div className="profile-content">
                    <div>User not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-header">
            <div className="profile-content">
                <div className="avatar-container">
                    <img 
                        src={withBackendBase(user.profilePicture) || avatarFallback} 
                        className="avatar" 
                        alt={`${user.username || user.name}'s avatar`} 
                    />
                    <Link to="/settings?tab=profile" className="change-avatar-btn">
                        <Edit size={16} />
                    </Link>
                </div>

                <div>
                    <h2>{user.username || user.name}</h2>
                    <span>u/{user.username || user.name}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;