import ProfileTabs from "./ProfileTabs";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

import avatar from "../../assets/Reddit_Avatar.webp";

function ProfileHeader(){
    return(
        <div className="profile-header">
            <div className="profile-content">
                <div className="avatar-container">
                    <img src={avatar} className="avatar" />
                    <Link to="/settings?tab=profile" className="change-avatar-btn">
                        <Edit size={16} />
                    </Link>
                </div>
                <div>
                    <h2>StatusStatus1185</h2>
                    <span>u/StatusStatus1185</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;