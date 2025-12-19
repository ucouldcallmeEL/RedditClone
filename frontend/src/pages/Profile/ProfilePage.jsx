import {useState} from "react"

import ProfileHeader from "./ProfileHeader"
import ProfileMain from "./ProfileMain"
import ProfileSidebar from "./ProfileSidebar";
import ProfileTabs from "./ProfileTabs";


import "./Profile.css"
import React from "react"


function ProfilePage(){

    const [activeTab , setActiveTab] = useState("Overview");

    return(
        <div className="profile-page">
            <div className="profile-layout">
                <div className="profile-left">
                    <ProfileHeader />

                    <ProfileTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <ProfileMain activeTab={activeTab} />
                </div>
                <ProfileSidebar />
            </div>
        </div>
    )
}
export default ProfilePage