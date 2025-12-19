import Section from "../Section";
import Field from "../Field/Field";
import ArrowButton from "../ArrowButton/ArrowButton";
import ConnectDisconnectButton from "../ConnectDisconnectButton/ConnectDisconnectButton";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";



function SettingsAccountContent({gender , handleGenderChange}){

    

    return (
        <>

            <Section title="General">
                            <Field title="Email Address">
                                <p>test@mail.com</p>
                                <ArrowButton></ArrowButton>
                            </Field>
                            <Field title="Gender">
                                <p>{gender}</p>
                                <ArrowButton onClick={() => handleGenderChange()}/> 
                            </Field>
                            <Field title="Location customization">
                                <p>Use approximate location (based on IP)</p>
                                <ArrowButton/>
                            </Field>
                        </Section>
                        <Section title="Account authorization">
                            <Field  title="Google"
                                    description="Connect to log in to Reddit with your Google account">
                                <ConnectDisconnectButton/>
                            </Field>
                            <Field  title="Apple"
                                    description="Connect to log in to Reddit with your Apple account">
                                <ConnectDisconnectButton/>
                            </Field>
                            <Field title="Two-factor authentication">
                                <ToggleSwitch/>
                            </Field>
                        </Section>
                        <Section title="Reddit Premium">
                            <Field title="Get premium">
                                <ArrowButton/>
                            </Field>
                        </Section>
                        <Section title="Advanced">
                            <Field title="Delete account">
                                <ArrowButton/>
                            </Field>
                        </Section>

        </>
    );
}
export default SettingsAccountContent;