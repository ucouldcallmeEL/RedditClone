import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import TextField from "./TextField";
import { userRoutes, apiPost } from "../../config/apiRoutes";
import "./Login.css";

const LogIn = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formIsValid) return;
    setLoginError(false); // Reset error on new submit

    try {
      const response = await apiPost(userRoutes.login, {
        identifier: email,
        password: password,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login error:", data.error);
        setLoginError(true);
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

      // Close modal and navigate
      if (onClose) {
        onClose();
      }
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const isEmailValid = (val) => /\S+@\S+\.\S+/.test(val) || val.length > 3;
  const isPasswordValid = (val) => val.length > 0;
  // Email validator for display: invalid if format is wrong OR if there's a login error
  const isEmailValidForDisplay = (val) => isEmailValid(val) && !loginError;
  // Password validator for display: invalid if empty OR if there's a login error
  const isPasswordValidForDisplay = (val) => val.length > 0 && !loginError;

  const formIsValid = isEmailValid(email) && isPasswordValid(password);

  // Get error messages for each field
  const getEmailErrorMessage = () => {
    if (!email || email.length === 0) {
      return "Fill out this field";
    }
    // Don't show error message for email field on login error (only show outline)
    // The error message will be shown under password field instead
    return null;
  };

  const getPasswordErrorMessage = () => {
    if (!password || password.length === 0) {
      return "Fill out this field";
    }
    if (loginError) {
      return "Invalid username or password";
    }
    return null;
  };

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
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
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="log-in-modal-content">
        <h1 className="log-in-modal-title">Log In</h1>

        <p className="log-in-modal-text">
          By continuing, you agree to our{" "}
          <a href="./UserAgreement.html">User Agreement</a> and acknowledge that
          you understand our <a>Privacy Policy</a>.
        </p>
        {/* <Buttons /> */}
        <Button
          icon="/phone.png"
          alt="Phone Icon"
          label="Continue with Phone Number"
          onClick={() => navigate("/signinPhone")}
        />

        <Button
          icon="/google-logo.png"
          alt="Google Logo"
          label="Continue with Google"
          onClick={() => console.log("Google button")}
        />

        <Button
          icon="/apple-logo-png.png"
          alt="Apple Logo"
          label="Continue with Apple"
          onClick={() => console.log("Apple button")}
        />

        <Button
          icon="/link.png"
          alt="Link Icon"
          label="Email me a one-time link"
          onClick={() => console.log("Magic link button")}
        />
      </div>
      <div className="or-divider">
        <hr className="or-divider-line" />
        <span className="or-divider-text">OR</span>
      </div>
      <div className="email">
        <TextField
          label="Email or username"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLoginError(false); // Clear login error when user types
          }}
          required
          validator={isEmailValidForDisplay}
          errorMessage={getEmailErrorMessage()}
          forceError={loginError}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginError(false); // Clear login error when user types
          }}
          required
          validator={isPasswordValidForDisplay}
          errorMessage={getPasswordErrorMessage()}
          forceError={loginError}
        />
      </div>
      <div className="log-in-modal-other-links">
        <div>
          <p className="forgot-password-link">
            <Link className="Reset-and-signup" to="/reset">
              Forgot password?
            </Link>
          </p>
        </div>
        <div>
          <p className="signup-prompt">
            New to Reddit?{" "}
            <Link className="Reset-and-signup" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className="log-in-modal-content">
        <div
          className={`LogIn-button login-action-button ${!formIsValid ? "disabled" : ""
            }`}
          onClick={formIsValid ? handleSubmit : undefined}
        >
          <span
            className={`log-in-button-text ${!formIsValid ? "disabled" : ""}`}
          >
            Log In
          </span>
        </div>
        {/* <Button
          label="Log In"
          disabled={!formIsValid}
          onClick={formIsValid ? handleSubmit : undefined}
        /> */}
      </div>
    </div>
  );
};

export default LogIn;
