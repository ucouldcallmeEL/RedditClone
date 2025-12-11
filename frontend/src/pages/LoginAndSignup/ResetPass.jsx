import React from "react";
import { useState } from "react";
import TextField from "./TextField";
import "./Login.css";
import "./TextField.css";

const ResetPass = () => {
  function handleClose() {
    console.log("Close button clicked");
  }

  const [email, setEmail] = useState("");
  const isEmailValid = (val) => /\S+@\S+\.\S+/.test(val) || val.length > 3;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };
  const formIsValid = isEmailValid(email);

  return (
    <auth-flow-modal className="log-in-modal">
      <div>
        <button className="quit-login-button" onClick={handleClose}>
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
      <div className="log-in-modal-content">
        <h1 className="log-in-modal-title">Reset your password</h1>

        <p className="log-in-modal-text">
          Enter your email address or username and we'll send you a link to
          reset your password.
        </p>

        <TextField
          label="Email or username"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          validator={isEmailValid}
          errorMessage="Fill out this field."
        />

        <div>
          <p className="forgot-password-link">
            <a className="Reset-and-signup" href="./ResetPass">
              Need help?
            </a>
          </p>
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
          Reset password
        </span>
      </div>
    </auth-flow-modal>
  );
};
export default ResetPass;
