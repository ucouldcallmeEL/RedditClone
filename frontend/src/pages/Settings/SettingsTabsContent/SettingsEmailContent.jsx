import { useState, useEffect } from "react";
import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Button from "../Button/Button";
import { updateUser } from "../../../config/apiRoutes";

function SettingsEmailContent() {
    const [adminNotifications, setAdminNotifications] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Check deep nested property safely
            const settings = parsedUser.notificationSettings?.email?.adminNotifications;
            // If settings is valid boolean, use it; otherwise default to true
            if (settings !== undefined) {
                setAdminNotifications(settings);
            }
        }
    }, []);

    const handleAdminToggle = async (newState) => {
        setAdminNotifications(newState);

        if (user) {
            // Update local state object to reflect change immediately
            const updatedUser = { ...user };
            if (!updatedUser.notificationSettings) updatedUser.notificationSettings = {};
            if (!updatedUser.notificationSettings.email) updatedUser.notificationSettings.email = {};
            updatedUser.notificationSettings.email.adminNotifications = newState;

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Save to Backend
            try {
                await updateUser(user._id, updatedUser.notificationSettings);
            } catch (error) {
                console.error("Failed to save settings to backend", error);
                // Optionally revert state here if critical
            }
        }
    };

    return (
        <>

            <Section title="Messages">
                <Field title="Admin notifications">
                    <ToggleSwitch
                        isOn={adminNotifications}
                        onToggle={handleAdminToggle}
                    />
                </Field>

                <Field title="Chat requests">
                    <ToggleSwitch />
                </Field>
            </Section>

            <Section title="Activity">
                <Field title="New user welcome">
                    <ToggleSwitch />
                </Field>

                <Field title="Comments on your posts">
                    <ToggleSwitch />
                </Field>

                <Field title="Replies to your comments">
                    <ToggleSwitch />
                </Field>

                <Field title="Upvotes on your posts">
                    <ToggleSwitch />
                </Field>

                <Field title="Upvotes on your comments">
                    <ToggleSwitch />
                </Field>

                <Field title="Username mentions">
                    <ToggleSwitch />
                </Field>

                <Field title="New followers">
                    <ToggleSwitch />
                </Field>
            </Section>


            <Section title="Newsletters">
                <Field title="Daily Digest">
                    <ToggleSwitch />
                </Field>
                <Field title="Weekly Recap">
                    <ToggleSwitch />
                </Field>
                <Field title="Weekly Topic">
                    <ToggleSwitch />
                </Field>
            </Section>
            <Section title="Advanced">
                <Field title="Unsubscribe from all emails">
                    <ToggleSwitch />
                </Field>
            </Section>
        </>
    );
}

export default SettingsEmailContent;
