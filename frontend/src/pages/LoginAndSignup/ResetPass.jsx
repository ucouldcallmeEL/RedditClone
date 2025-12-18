import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "./TextField";
import "./Login.css";
import "./TextField.css";

const ResetPass = ({ onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const [email, setEmail] = useState("");
  const isEmailValid = (val) => /\S+@\S+\.\S+/.test(val) || val.length > 3;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };
  const formIsValid = isEmailValid(email);

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div className="top-content">
        <div className="top-content">
          <div className="button-wrapper">
            <button className="quit-reset-button" onClick={() => navigate("/")}>
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
            Reset your password
          </h1>

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

          <p className="forgot-password-link">
            <a href="./ResetPass">Need help?</a>
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
    </div>
  );
};
export default ResetPass;
