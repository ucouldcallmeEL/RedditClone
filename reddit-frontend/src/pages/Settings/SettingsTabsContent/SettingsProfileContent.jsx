import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import ContentVisibilityBlock from "../ContentVisibilityBlock/ContentVisibilityBlock";
import styles from "./SettingsProfileContent.module.css"

function SettingsProfileContent({displayedName , handleDisplayNameChange , handleAboutChange , handleAvatarChange , handleBannerChange}){

    return (
        <>
            <Section title="General">
                <Field  title="Display name"
                        description="Changing your display name won’t change your username">
                    <p>{displayedName}</p>
                    <ArrowButton onClick={() => handleDisplayNameChange()}/>
                </Field>
                <Field title="About description">
                    <ArrowButton onClick={() => handleAboutChange()}/>
                </Field>
                <Field  title="Avatar"
                        description="Edit your avatar or upload an image">
                    <ArrowButton onClick={() => handleAvatarChange()}/>
                </Field>
                <Field  title="Banner"
                        description="Upload a profile background image">
                    <ArrowButton onClick={() => handleBannerChange()}/>
                </Field>
                <Field title="Social links"><ArrowButton/></Field>
                <Field  title="Mark as mature (18+)"
                        description="Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18">
                            <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Curate your profile">
                <Field  title="Manage what content shows on your profile."
                        titleClassName={styles.titleFaded}/>
                <ContentVisibilityBlock/>
                <Field  title="NSFW"
                        description="Show all NSFW posts and comments">
                    <ToggleSwitch/>
                </Field> 
                <Field  title="Followers"
                        description="Show your follower count"
                        >
                        <ToggleSwitch/>
                </Field>
                <div className={styles.box}>
                    <p><a href="https://support.reddithelp.com/hc/en-us/articles/360043471231-How-do-I-update-my-profile-settings" target="blank">Profile Curation</a> only applies to your profile and your content stays visible in communities. Mods of communities you participate in and redditors whose profile posts you engage with can still see your full profile for moderation.</p>
                </div>
            </Section>
            <Section title="Advanced">
                <Field title="Profile moderation">
                    <LinkButton 
                        onClick={() => window.open("https://www.reddit.com/user/StatusStatus1185/about/edit/moderation/" , "_blank")}/>
                </Field>
            </Section>
        </>
    );

}
export default SettingsProfileContent;