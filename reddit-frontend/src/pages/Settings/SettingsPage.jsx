import {useState , useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

import defaultAvatar from "../../assets/Reddit_Avatar.webp";
import "./Settings.css";

function SettingsPage() {

    const userId = "69397ceee2ea8af09ca7899c" //Until we Implement storage for Id

    const location = useLocation();
    const navigate = useNavigate();

    // Other states
    const [gender , setGender] = useState("Man");
    const [displayedName , setDisplayedName] = useState("");
    const [about , setAbout] = useState("");
    const [avatar , setAvatar] = useState(defaultAvatar);
    const [banner , setBanner] = useState(null);
    const [lang , setLang] = useState("English");
    const [view , setView] = useState("Card");

    // Read tab from URL
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    // Compute active index
    const activeIndex =
        tab === "profile" ? 1 :
        tab === "privacy" ? 2 :
        tab === "preferences" ? 3 :
        tab === "notifications" ? 4 :
        tab === "email" ? 5 :
        0;


    useEffect(() => {
        async function fetchUser(){
            const res = await axios.get(`http://localhost:5000/users/${userId}`);
            setAvatar(res.data.profilePicture || defaultAvatar);
            setBanner(res.data.coverPicture || null);
        }
        fetchUser();
    }, []);

    // Handlers
    async function handleGenderChange() {
        const changedGender = await openGenderPopup(gender);
        if (changedGender !== null) setGender(changedGender);
    }

    async function handleDisplayNameChange() {
        const name = await openTextPopup({
            title: "Display name",
            description: "Changing your display name won't change your username",
            placeholder: "Display name",
            maxChars: 90,
            defaultValue: displayedName
        });
        if (name !== null) setDisplayedName(name);
    }

    async function handleDescChange() {
        const desc = await openTextPopup({
            title: "About description",
            description: "Give a brief description of yourself",
            placeholder: "About",
            maxChars: 200,
            defaultValue: about
        });
        if (desc !== null) setAbout(desc);
    }

    async function handleAvatarChange() {
        const result = await openImagePopup(avatar);
        if (!result) return;

        const form = new FormData();
        form.append("file", result.file);

        const upload = await axios.post(`http://localhost:5000/upload/profile/${userId}`, form, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setAvatar(upload.data.url);
    }

    async function handleBannerChange() {
        const result = await openBannerPopup(banner);
        if (!result) return;

        const form = new FormData();
        form.append("file", result.file);

        const upload = await axios.post(`http://localhost:5000/upload/cover/${userId}`, form, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setBanner(upload.data.url);
    }

    async function handleLangChange() {
        const language = await openLanguagePopup(lang);
        if (language !== null) setLang(language);
    }

    async function handleViewChange() {
        const newView = await openViewPopup(view);
        if (newView !== null) setView(newView);
    }

    // Tab navigation helper
    const go = (tabName) =>
        navigate(tabName ? `?tab=${tabName}` : "");

    return (
        <div className="settings-container">
            <h1>Settings</h1>

            <div className="settings-tabs">
                <SettingsTab title="Account" isActive={activeIndex===0} onShow={() => go("")}/>
                <SettingsTab title="Profile" isActive={activeIndex===1} onShow={() => go("profile")}/>
                <SettingsTab title="Privacy" isActive={activeIndex===2} onShow={() => go("privacy")}/>
                <SettingsTab title="Preferences" isActive={activeIndex===3} onShow={() => go("preferences")}/>
                <SettingsTab title="Notifications" isActive={activeIndex===4} onShow={() => go("notifications")}/>
                <SettingsTab title="Email" isActive={activeIndex===5} onShow={() => go("email")}/>
            </div>

            <div className="settings-content">
                {activeIndex === 0 && (
                    <SettingsAccountContent 
                        gender={gender}
                        handleGenderChange={handleGenderChange}
                    />
                )}

                {activeIndex === 1 && (
                    <SettingsProfileContent
                        displayedName={displayedName}
                        handleDisplayNameChange={handleDisplayNameChange}
                        handleAboutChange={handleDescChange}
                        handleAvatarChange={handleAvatarChange}
                        handleBannerChange={handleBannerChange}
                    />
                )}

                {activeIndex === 2 && <SettingsPrivacyContent/>}

                {activeIndex === 3 && (
                    <SettingsPreferencesContent
                        language={lang}
                        feedView={view}
                        handleLangChange={handleLangChange}
                        handleViewChange={handleViewChange}
                    />
                )}

                {activeIndex === 4 && <SettingsNotificationsContent/>}
                {activeIndex === 5 && <SettingsEmailContent/>}
            </div>
        </div>
    );
}

export default SettingsPage;
