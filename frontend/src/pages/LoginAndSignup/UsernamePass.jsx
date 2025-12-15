import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "./TextField";
import "./Login.css";
import "./TextField.css";

const CreateUser = () => {
  const navigate = useNavigate();
  function handleClose() {
    console.log("Close button clicked");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isUsernameValid = (val) => val.trim().length >= 3;
  const isPasswordValid = (val) => val.length > 0;
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!formIsValid) return;
    console.log({ username, password });
  };
  const formIsValid = isUsernameValid(username) && isPasswordValid(password);

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div className="top-content">
        <div className="top-content">
          <div className="button-wrapper">
            <button className="quit-reset-button" onClick={() => navigate("/signup")}>
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
            Create your username and password
          </h1>

          <p className="log-in-modal-text">
            Reddit is anonymous, so your username is what you'll go by here.
            Choose wisely-because once you get a name, you can't change it.
          </p>

          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            validator={isUsernameValid}
            errorMessage="Choose a username."
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            validator={isPasswordValid}
            errorMessage="Fill out this field."
          />
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
export default CreateUser;
