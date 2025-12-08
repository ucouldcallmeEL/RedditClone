import {useState , useEffect } from "react";

import { useLocation } from "react-router-dom";



import SettingsTab from "./SettingsTab";
import SettingsAccountContent from "./SettingsTabsContent/SettingsAccountContent";
import SettingsProfileContent from "./SettingsTabsContent/SettingsProfileContent";
import SettingsPrivacyContent from "./SettingsTabsContent/SettingsPrivacyContent";
import SettingsPreferencesContent from "./SettingsTabsContent/SettingsPreferencesContent";
import SettingsNotificationsContent from "./SettingsTabsContent/SettingsNotificationsContent";
import SettingsEmailContent from "./SettingsTabsContent/SettingsEmailContent";
import openGenderPopup from "./popups/openGenderPopup";
import openTextPopup from "./popups/PopupTextInput";
import openImagePopup from "./popups/openImagePopup";
import openBannerPopup from "./popups/openBannerPopup";
import openLanguagePopup from "./popups/openLanguagePopup";
import openViewPopup from "./popups/openViewPopup";
import defaultAvatar from "../../assets/Reddit_Avatar.webp"

import "./Settings.css"


function SettingsPage() {

    const location = useLocation();
    


    //States
    const [activeIndex, setActiveIndex] = useState(0);
    const [gender , setGender] = useState("Man");
    const [displayedName , setDisplayedName] = useState("");
    const [about , setAbout] = useState("");
    const [avatar , setAvatar] = useState(defaultAvatar);
    const [banner , setBanner] = useState(null);
    const [lang , setLang] = useState("English");
    const [view , setView] = useState("Card");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");

        if (tab === "notifications") {
            setActiveIndex(4);// Notifications tab index
        }
        else if (tab === "email"){
            setActiveIndex(5);
        }
    }, [location.search]);

    async function handleGenderChange(){
        const changedGender = await openGenderPopup(gender);
        if(changedGender === null) {return}
        setGender(changedGender);
    }
    async function handleDisplayNameChange(){
        const name = await openTextPopup({
            title: "Display name",
            description: "Changing your display name won't change your username",
            placeholder: "Display name",
            maxChars: 90 , 
            defaultValue: displayedName
        }); 
        if (name === null){return}
        setDisplayedName(name);
    }
    async function handleDescChange(){

        const desc = await openTextPopup({
            title: "About description",
            description: "Give a brief description of yourself",
            placeholder: "About",
            maxChars: 200 , 
            defaultValue: about
        });
        if(desc === null) {return}
        setAbout(desc);
        
    }
    async function handleAvatarChange(){
        const result = await openImagePopup(avatar);
        if(result === null){return}
        setAvatar(result.preview);
    }

    async function handleBannerChange(){
        const result = await openBannerPopup(banner);
        if(result === null){return}
        setBanner(result.preview);
    }

    async function handleLangChange(){
        const language = await openLanguagePopup(lang);
        if(language === null){return}
        setLang(language);
    }
    async function handleViewChange(){
        const newView = await openViewPopup(view);
        if(newView === null){return}
        setView(newView);
    }

    return(
        <>
            <div className="settings-container">
                <h1>Settings</h1>
                <div className="settings-tabs">
                    <SettingsTab 
                                title="Account" 
                                isActive={activeIndex === 0} 
                                onShow={() => setActiveIndex(0)}>
                    </SettingsTab>
                    <SettingsTab
                                title="Profile" 
                                isActive={activeIndex === 1} 
                                onShow={() => setActiveIndex(1)}>
                    </SettingsTab>
                    <SettingsTab
                                title="Privacy" 
                                isActive={activeIndex === 2} 
                                onShow={() => setActiveIndex(2)}>
                    </SettingsTab>
                    <SettingsTab
                                title="Preferences"
                                isActive={activeIndex === 3}
                                onShow={() => setActiveIndex(3)}>
                    </SettingsTab>
                    <SettingsTab
                                title="Notifications"
                                isActive={activeIndex===4}
                                onShow={() => setActiveIndex(4)}>
                    </SettingsTab>
                    <SettingsTab
                                title="Email"
                                isActive={activeIndex===5}
                                onShow={() => setActiveIndex(5)}>
                    </SettingsTab>
                </div>
                <div className="settings-content">
                    {activeIndex === 0 && (
                        <SettingsAccountContent 
                            gender={gender}
                            handleGenderChange={handleGenderChange}/>
                    )}
                    
                    {activeIndex === 1 && (
                        <SettingsProfileContent
                            displayedName={displayedName}
                            handleDisplayNameChange={handleDisplayNameChange}
                            handleAboutChange={handleDescChange}
                            handleAvatarChange={handleAvatarChange}
                            handleBannerChange={handleBannerChange}/>
                    )}

                    {activeIndex === 2 && (
                        <SettingsPrivacyContent/>
                    )}
                    {activeIndex === 3 && (
                        <SettingsPreferencesContent
                        language={lang}
                        feedView={view}
                        handleLangChange={handleLangChange}
                        handleViewChange={handleViewChange}/>
                    )}
                    {activeIndex === 4 && (
                        <SettingsNotificationsContent/>
                    )}
                    {activeIndex === 5 && (
                        <SettingsEmailContent/>
                    )}
                </div>
            </div>
        </>
    );


}
export default SettingsPage;