import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "./TextField";
import { userRoutes, apiPost, apiGet } from "../../config/apiRoutes";
import "./Login.css";
import "./TextField.css";

const CreateUser = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get email from location state or localStorage
  const [email] = useState(location.state?.email || localStorage.getItem("signupEmail") || "");

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isUsernameValid = (val) => val.trim().length >= 3;
  const isPasswordValid = (val) => val.length > 0;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!formIsValid || !email) return;

    try {
      const response = await apiPost(userRoutes.signup, {
        email: email,
        username: username,
        password: password,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup error:", data.error);
        // TODO: Show error message to user
        return;
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Dispatch event to notify sidebar
        window.dispatchEvent(new CustomEvent('user-updated'));
      }

      // Clear temporary email storage
      localStorage.removeItem("signupEmail");

      navigate("/interests");
    } catch (error) {
      console.error("Signup error:", error);
      // TODO: Show error message to user
    }
  };

  const formIsValid = isUsernameValid(username) && isPasswordValid(password);

  const fetchGeneratedUsername = async () => {
    try {
      const response = await apiGet(userRoutes.generateUsername);
      const data = await response.json();
      if (response.ok && data.username) {
        setUsername(data.username);
      }
    } catch (err) {
      console.error("Failed to generate username:", err);
    }
  };

  useEffect(() => {
    // Generate an initial username when the page loads
    fetchGeneratedUsername();

    // We intentionally only run this on mount
    // eslint-disable-next-line
  }, []);

  const GenerateUsernameIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.895 10a.9.9 0 01-1.8 0c0-2.812-2.286-5.1-5.1-5.1h-2.92l1.363 1.362A.898.898 0 018.8 7.798a.897.897 0 01-.637-.264L5.265 4.636a.898.898 0 010-1.272l2.898-2.9a.897.897 0 011.274 0 .898.898 0 010 1.273L8.074 3.099h2.921c3.806 0 6.9 3.095 6.9 6.9zm-8.891 6.9h2.921l-1.363 1.362a.898.898 0 00.638 1.536.897.897 0 00.636-.264l2.899-2.898a.898.898 0 000-1.272l-2.899-2.898a.897.897 0 00-1.274 0 .898.898 0 000 1.272l1.364 1.362H9.003a5.106 5.106 0 01-5.1-5.1.9.9 0 00-1.8 0c0 3.805 3.096 6.9 6.9 6.9z"></path>
    </svg>
  );

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div className="top-content">
        <div className="top-content">
          <div className="button-wrapper">
            <button
              className="quit-reset-button"
              onClick={() => navigate("/signup")}
            >
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
            rightButton={<GenerateUsernameIcon />}
            onRightButtonClick={fetchGeneratedUsername}
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
        className={`LogIn-button login-action-button ${!formIsValid ? "disabled" : ""
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
