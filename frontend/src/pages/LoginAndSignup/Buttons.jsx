import React from 'react';

const Buttons = () => {
    return (
        <div>
            <div className="LogIn-button">
                <img className="logo" src="/phone.svg" alt="Phone Icon" width="20"/>
                <span className="LogIn-button-text">
                    Continue with Phone Number
                </span>
            </div>
            <div className="LogIn-button">
                <img className="logo" src="/google-logo.png" alt="Google Logo" width="20"/>
                <span>Continue with Google</span>
            </div>
            <div className="LogIn-button">
                <img className="logo" src="/apple-logo-png.png" alt="Apple Logo" width="20"/>
                <span>Continue with Apple</span>
            </div>
            <div className="LogIn-button">
                <img className="logo" src="/link.svg" alt="Link Icon" width="20"/>
                <span>Email me a one-time link</span>
            </div>
        </div>
    );
};

export default Buttons;

