import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import TextField from "./TextField";
import { userRoutes, apiPost } from "../../config/apiRoutes";
import "./Login.css";

const Signup = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  //   const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!formIsValid) return;
    
    setIsChecking(true);
    setEmailError("");

    try {
      const response = await apiPost(userRoutes.checkEmail, { email });
      
      // Handle network errors or failed fetch
      if (!response) {
        throw new Error("No response from server");
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, use status text
        throw new Error(response.statusText || "Invalid response from server");
      }

      if (!response.ok) {
        if (response.status === 409 && data.exists) {
          setEmailError("Email already exists. Try logging in.");
        } else {
          setEmailError(data.error || "An error occurred. Please try again.");
        }
        setIsChecking(false);
        return;
      }

      // Email is available, proceed to next step
      if (email) {
        localStorage.setItem("signupEmail", email);
      }
      navigate("/create-user", { state: { email } });
    } catch (error) {
      console.error("Check email error:", error);
      // Handle network errors (backend not running, connection refused, etc.)
      if (
        error.message?.includes("Failed to fetch") || 
        error.message?.includes("NetworkError") ||
        error.message?.includes("ERR_CONNECTION_REFUSED") ||
        error.name === "TypeError"
      ) {
        setEmailError("Unable to connect to server. Please check your connection and try again.");
      } else {
        setEmailError(error.message || "An error occurred. Please try again.");
      }
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const isEmailFormatValid = (val) =>
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/i.test(val);
  //   const isPasswordValid = (val) => val.length > 0;

  // Validator function that checks both format and API error state
  const emailValidator = (val) => {
    // If there's an API error, the email is invalid
    if (emailError) return false;
    // Otherwise check format
    return isEmailFormatValid(val);
  };

  const formIsValid = isEmailFormatValid(email) && !emailError; // && isPasswordValid(password);

  // Get error message for email field
  const getEmailErrorMessage = () => {
    if (emailError) {
      return emailError;
    }
    if (!email || email.length === 0) {
      return "Fill out this field";
    }
    if (!isEmailFormatValid(email)) {
      return "Invalid email";
    }
    return null;
  };

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div>
        <div className="top-content">
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
            <h1 className="log-in-modal-title">Sign Up</h1>

            <p className="log-in-modal-text">
              By continuing, you agree to our{" "}
              <a href="./UserAgreement.html">User Agreement</a> and acknowledge
              that you understand our <a>Privacy Policy</a>.
            </p>
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
          </div>
          <div className="or-divider">
            <hr className="or-divider-line" />
            <span className="or-divider-text">OR</span>
          </div>
          <div className="email">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(""); // Clear error when user types
              }}
              required
              validator={emailValidator}
              errorMessage={getEmailErrorMessage()}
            />
          </div>
          <div className="log-in-modal-other-links">
            <div>
              <p className="signup-prompt">
                Already a Redditor?{" "}
                <Link className="Reset-and-signup" to="/login">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="log-in-modal-content">
        <div
          className={`LogIn-button login-action-button ${
            !formIsValid || isChecking ? "disabled" : ""
          }`}
          onClick={formIsValid && !isChecking ? handleSubmit : undefined}
        >
          <span
            className={`log-in-button-text ${!formIsValid || isChecking ? "disabled" : ""}`}
          >
            {isChecking ? "Checking..." : "Continue"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
