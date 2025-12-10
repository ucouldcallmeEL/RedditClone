import React from 'react';
import { useState } from 'react';
import Buttons from './Buttons';
import TextField from './TextField';
import './Login.css';  

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);
    };

    const handleClose = () => {
        console.log('Close button clicked');
    };

    const isEmailValid = (val) => /\S+@\S+\.\S+/.test(val) || val.length > 3;
    const isPasswordValid = (val) => val.length > 0;

    const formIsValid = isEmailValid(email) && isPasswordValid(password);


    return (
        <auth-flow-modal className="log-in-modal">
            <button className="quit-login-button" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <div className="log-in-modal-content">
                <h1 className="log-in-modal-title">Log In</h1>
                
                <p className="log-in-modal-text">By continuing, you agree to our <a href="./UserAgreement.html">User Agreement</a> and acknowledge that you understand our <a>Privacy Policy</a>.</p>
                <Buttons />
            </div>
            <div className="or-divider">
                <hr className="or-divider-line" />
                <span className="or-divider-text">OR</span>
            </div>
            <TextField 
            label="Email or username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            validator={isEmailValid}
            errorMessage="Enter a valid email or username"
            />

            <TextField 
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            validator={isPasswordValid}
            errorMessage="Password cannot be empty"
            />

            <div className = "log-in-modal-other-links">
            <div><p className="forgot-password-link"><a href="./ResetPass">Forgot password?</a></p></div>
            <div><p className="signup-prompt">New to Reddit? <a href="./Signup">Sign Up</a></p></div>
            </div>
            <div className="log-in-modal-content">
                <div 
                    className={`LogIn-button login-action-button ${!formIsValid ? "disabled" : ""}`}
                    onClick={formIsValid ? handleSubmit : undefined}
                >
                    <span className={`log-in-button-text ${!formIsValid ? "disabled" : ""}`}>Log In</span>
                </div>
            </div>

        </auth-flow-modal>
    );
};

export default LogIn;
