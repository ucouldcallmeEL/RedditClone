import React from "react";
import { useState } from "react";
import TextField from "./TextField";
import { userRoutes, apiPost } from "../../config/apiRoutes";
import "./Login.css";
import "./TextField.css";
import { Link, useNavigate } from "react-router-dom";

const SigninPhone = ({ onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const [phone, setPhone] = useState("");
  const isPhoneValid = (val) => {
    const cleaned = val.replace(/[\s-()]/g, "");
    return /^(\+)?\d{8,15}$/.test(cleaned);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formIsValid) return;

    const cleaned = phone.replace(/[\s-()]/g, "");

    try {
      // First, try to sign in with the phone number
      const response = await apiPost(userRoutes.phoneSignin, { phone: cleaned });
      const data = await response.json();

      if (!response.ok) {
        console.error("Phone signin error:", data);
        return;
      }

      if (data.isNewUser) {
        // Phone not found -> create a new user with this phone
        const signupResponse = await apiPost(userRoutes.phoneSignup, { phone: cleaned });
        const signupData = await signupResponse.json();

        if (!signupResponse.ok) {
          console.error("Phone signup error:", signupData);
          return;
        }

        // Store token and user data
        if (signupData.token) {
          localStorage.setItem("token", signupData.token);
        }
        if (signupData.user) {
          localStorage.setItem("user", JSON.stringify(signupData.user));
        }

        // Redirect to interests page for new users
        navigate("/interests");
      } else {
        // Existing user: store token and user data
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/");
      }
    } catch (err) {
      console.error("Phone signin/signup failed:", err);
    }
  };
  const formIsValid = isPhoneValid(phone);

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
        className={`LogIn-button login-action-button log-in-modal-content ${
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
export default SigninPhone;
