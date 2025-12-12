import React from "react";
import { useState } from "react";
import TextField from "./TextField";
import "./Login.css";
import "./TextField.css";

const ResetPass = () => {
  function handleClose() {
    console.log("Close button clicked");
  }

  const [phone, setPhone] = useState("");
  const isPhoneValid = (val) => {
    const cleaned = val.replace(/[\s-()]/g, "");
    return /^(\+)?\d{8,15}$/.test(cleaned);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(phone);
  };
  const formIsValid = isPhoneValid(phone);

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div className="top-content">
        <div className="top-content">
          <div className="button-wrapper">
            <button className="quit-reset-button" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M 17.5 9.1 H 4.679 l 5.487 -5.462 a 0.898 0.898 0 0 0 0.003 -1.272 a 0.898 0.898 0 0 0 -1.272 -0.003 l -7.032 7 a 0.898 0.898 0 0 0 0 1.275 l 7.03 7 a 0.896 0.896 0 0 0 1.273 -0.003 a 0.898 0.898 0 0 0 -0.002 -1.272 l -5.487 -5.462 h 12.82 a 0.9 0.9 0 0 0 0 -1.8 Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="quit-reset-button" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="log-in-modal-content">
          <h1 className="log-in-modal-title reset-title">
            Sign up or log in with your phone number
          </h1>

          <TextField
            label="Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            validator={isPhoneValid}
            errorMessage="Fill out this field."
          />
          <div className="signin-phone-text">
            <p className="signin-phone-modal-text">
              Reddit will use your phone number for account verification and to
              personalize your ads and experience. SMS fees may apply.
            </p>

            <p className="signin-phone-link">
              <a href="./ResetPass">Learn more.</a>
            </p>
          </div>
        </div>
      </div>

      <div
        className={`LogIn-button login-action-button ${
          !formIsValid ? "disabled" : ""
        }`}
        onClick={formIsValid ? handleSubmit : undefined}
      >
        <span
          className={`log-in-button-text ${!formIsValid ? "disabled" : ""}`}
        >
          Continue
        </span>
      </div>
    </div>
  );
};
export default ResetPass;
