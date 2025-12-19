import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import ClearButton from "../Button/Button";


function SettingsPreferencesContent({language="English (US)" , feedView="Card" , handleLangChange , handleViewChange}){

    
    
    return (
        <>
            <Section title="Language">
                <Field title="Display language">
                        <p>{language}</p>
                        <ArrowButton onClick={() => handleLangChange()}/>
                </Field>
                <Field title="Content languages">
                    <ArrowButton/>
                </Field>
            </Section>
            <Section title="Content">
                <Field  title="Show mature content (I'm over 18)"
                        description="See Not Safe for Work mature and adult content in your feeds and search results"
                        >
                        <ToggleSwitch/>
                </Field>
                <Field title="Blur mature (18+) images and media">
                    <ToggleSwitch/>
                </Field>
                <Field title="Show recommendations in home feed">
                    <ToggleSwitch/>
                </Field>
                <Field title="Muted communities"><ArrowButton/></Field>
            </Section>
            <Section title="Accessibility">
                <Field title="Autoplay media">
                    <ToggleSwitch/>
                </Field>
                <Field title="Reduce Motion">
                    <ToggleSwitch/>
                </Field>
                <Field title="Sync with computer's motion settings">
                    <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Experience">
                <Field title="Use community themes">
                    <ToggleSwitch/>
                </Field>
                <Field title="Open posts in new tab">
                    <ToggleSwitch/>
                </Field>
                <Field title="Default feed view">
                    <p>{feedView}</p>
                    <ArrowButton onClick={() => handleViewChange()}/>
                </Field>
                <Field title="Default to markdown editor">
                    <ToggleSwitch/>
                </Field>
                <Field title="Keyboard shortcuts">
                    <ArrowButton/>
                </Field>
                <Field title="Default to old Reddit">
                    <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Sensitive advertising categories">
                <Field title="Limit ads in selected categories">
                    <ArrowButton/>
                </Field>
            </Section>
        </>
    );

}
export default SettingsPreferencesContent;