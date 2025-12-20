import { useState, useEffect } from "react";
import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Button from "../Button/Button";


function SettingsNotificationsContent() {
    // Initialize from localStorage or default to false
    const [webPushNotifications, setWebPushNotifications] = useState(() => {
        const saved = localStorage.getItem('webPushNotifications');
        return saved === 'true'; // Convert string 'true' to boolean true
    });

    const handleWebPushToggle = (newState) => {
        setWebPushNotifications(newState);
        localStorage.setItem('webPushNotifications', newState);
    };

    return (
        <>
            <Section title="General">
                <Field title="Community notifications">
                    <ArrowButton />
                </Field>
                <Field title="Web push notifications">
                    <ToggleSwitch
                        isOn={webPushNotifications}
                        onToggle={handleWebPushToggle}
                    />
                </Field>
            </Section>
            <Section title="Messages">
                <Field title="Chat messages">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Chat requests">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Mark all as read"
                    description="Mark all chat conversations as read"
                >
                    <Button text="Mark as read" />

                </Field>
            </Section>
            <Section title="Activity">
                <Field title="Mentions of u/username">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Comments on your posts">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Upvotes on your posts">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Upvotes on your comments">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Replies to your comments">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Activity on your comments">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="New followers">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Awards you receive">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Posts you follow">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Comments you follow">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Keyword alerts">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Achievement updates">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Streak reminders">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Insights on your posts">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Developer Platform app notifications">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
            </Section>
            <Section title="Recommendations">
                <Field title="Trending posts">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="ReReddit">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Featured content">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Breaking news">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
            </Section>
            <Section title="Updates">
                <Field title="Reddit announcements">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Cake day">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Admin notifications">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
                <Field title="Disabled admin notifications">
                    <p>0</p>
                    <ArrowButton />
                </Field>
            </Section>
            <Section title="Moderation">
                <Field title="Mod notifications">
                    <p>All on</p>
                    <ArrowButton />
                </Field>
            </Section>
        </>
    );
}
export default SettingsNotificationsContent