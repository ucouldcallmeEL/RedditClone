import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Button from "../Button/Button";

function SettingsPrivacyContent(){
    


    return (
        <>

            <Section title="Social interactions">
                <Field  title="Allow people to follow you"
                        description="Let people follow you to see your profile posts in their home feed">
                            <ToggleSwitch/>
                </Field>
                <Field title="Who can send you chat requests">
                    <p>Everyone</p>{/* Make State and method for this button */}
                    <ArrowButton/>
                </Field>
                <Field title="Blocked accounts"> {/* Not Implemented */}
                    <ArrowButton/>
                </Field>
            </Section>
            <Section title="Discoverability">
                <Field  title="List your profile on old.reddit.com/users"
                        description="List your profile on old.reddit.com/users and allow posts to your profile to appear in r/all"
                        >
                        <ToggleSwitch/>
                </Field>
                <Field  title="Show up in search results"
                        description="Allow search engines like Google to link to your profile in their search results"
                        >
                        <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Ads personalization">
                <Field  title="Personalize ads on Reddit based on information and activity from our partners"
                        description="Allow us to use information from our partners to show you better ads on Reddit"
                        >
                        <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Advanced">
                <Field title="Third-party app authorizations">
                    <LinkButton onClick={() => window.open("https://www.reddit.com/prefs/apps?solution=7c70d12181b155617c70d12181b15561&js_challenge=1&token=98b9ac52742346eb4260fb24415992d845e67a2eb1d3311781c8fb8cc90ccb50")}/>
                </Field>
                <Field title="Clear history"
                        description="Delete your post views history">
                            <Button text="Clear"/>
                </Field>
            </Section>
        
        </>
    )
}
export default SettingsPrivacyContent;