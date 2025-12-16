import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import LinkButton from "../LinkButton/LinkButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Button from "../Button/Button";

function SettingsEmailContent() {
    return (
        <>
            
            <Section title="Messages">
                <Field title="Admin notifications">
                    <ToggleSwitch />
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
                    <ToggleSwitch/>
                </Field>
                <Field title="Weekly Recap">
                    <ToggleSwitch/>
                </Field>
                <Field title="Weekly Topic">
                    <ToggleSwitch/>
                </Field>
            </Section>
            <Section title="Advanced">
                <Field title="Unsubscribe from all emails">
                    <ToggleSwitch/>
                </Field>
            </Section>
        </>
    );
}

export default SettingsEmailContent;
