import ProfileTabs from "./ProfileTabs";


import avatar from "../../assets/Reddit_Avatar.webp";

function ProfileHeader({ activeTab, setActiveTab }){
    return(
        <div className="profile-header">
            <div className="profile-content">
                <img src={avatar} className="avatar" />
                <div>
                    <h2>StatusStatus1185</h2>
                    <span>u/StatusStatus1185</span>
                </div>
            </div>

            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    )
}

export default ProfileHeader;