import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import TextField from "./TextField";
import "./Login.css";

const Signup = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");


  const handleSubmit = () => {
    setEmailError("");

    if (!email) {
      setEmailError("Fill out this field.");
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError("Invalid email address.");
      return;
    }

    localStorage.setItem("signupEmail", email);
    navigate("/create-user", { state: { email } });
  };


  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const isEmailValid = (val) =>
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/i.test(val);
  //   const isPasswordValid = (val) => val.length > 0;

  const formIsValid = isEmailValid(email); // && isPasswordValid(password);

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
              onChange={(e) => setEmail(e.target.value)}
              required
              validator={isEmailValid}
              error={emailError}
            />

          </div>
          <div className="log-in-modal-other-links">
            <div>
              <p className="signup-prompt">
                Already a Redditor?{" "}
                <Link className="Reset-and-signup" to="/">
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
    </div>
  );
};

export default Signup;
