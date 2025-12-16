import {useState} from "react"

import ProfileHeader from "./ProfileHeader"
import ProfileMain from "./ProfileMain"

import "./Profile.css"
import React from "react"


function ProfilePage(){

    const [activeTab , setActiveTab] = useState("Overview");

    return(
        <div className="profile-page">
            <ProfileHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}/>

            <ProfileMain activeTab={activeTab}/>
        </div>
    )
}
export default ProfilePage