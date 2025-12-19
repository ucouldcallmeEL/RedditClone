import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import axios from "axios";

import avatarFallback from "../../assets/Reddit_Avatar.webp";
import ProfileTabs from "./ProfileTabs";

function ProfileHeader() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState(avatarFallback);

    const storedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    const userId = storedUser?._id || storedUser?.id;

    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
            const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
            const data = res.data; // ✅ axios

            setUsername(data.username || data.name || "");
            setAvatar(data.profilePicture || avatarFallback);
            } catch (err) {
            console.error("Failed to fetch profile", err);
            }
        };

        fetchUser();
        }, [userId]);


    if (!userId) return null;

    return (
        <div className="profile-header">
            <div className="profile-content">
                <div className="avatar-container">
                    <img src={avatar} className="avatar" alt="avatar" />
                    <Link to="/settings?tab=profile" className="change-avatar-btn">
                        <Edit size={16} />
                    </Link>
                </div>

                <div>
                    <h2>{username}</h2>
                    <span>u/{username}</span>
                </div>
            </div>

        </div>
    );
}

export default ProfileHeader;
