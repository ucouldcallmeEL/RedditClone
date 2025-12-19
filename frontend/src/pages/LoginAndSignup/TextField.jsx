import React, { useState } from "react";
import "./TextField.css";

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M 7.09 15.84 c -0.23 0 -0.46 -0.09 -0.64 -0.26 L 1.3 10.42 a 0.9 0.9 0 0 1 0 -1.27 a 0.9 0.9 0 0 1 1.27 0 l 4.52 4.52 L 17.5 3.26 a 0.9 0.9 0 0 1 1.27 0 a 0.9 0.9 0 0 1 0 1.27 L 7.73 15.58 c -0.18 0.18 -0.41 0.26 -0.64 0.26 Z" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M 11.21 13.5 a 1.21 1.21 0 1 1 -2.42 0 a 1.21 1.21 0 0 1 2.42 0 Z M 19 10 c 0 -4.963 -4.038 -9 -9 -9 s -9 4.037 -9 9 s 4.038 9 9 9 s 9 -4.037 9 -9 Z m -1.801 0 c 0 3.97 -3.229 7.2 -7.199 7.2 c -3.97 0 -7.199 -3.23 -7.199 -7.2 S 6.03 2.8 10 2.8 c 3.97 0 7.199 3.23 7.199 7.2 Z m -6.441 1.24 l 0.242 -6 H 9 l 0.242 6 h 1.516 Z" />
  </svg>
);

const TextField = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  validator,
  errorMessage, // fallback message
  error, // 🔴 NEW: external error
  rightButton,
  onRightButtonClick,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  const isValid = validator ? validator(value) : true;

  // 🔴 NEW: error priority
  const showError =
    (!!error && !isFocused) ||
    (isTouched && !isValid && !isFocused);

  const displayedError = error || errorMessage;

  return (
    <div
      className={`text-field-container ${showError ? "error" : ""} ${
        rightButton ? "has-right-button" : ""
      }`}
    >
      <div className="text-field-inner">
        <input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e);
            if (!isTouched) setIsTouched(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setIsTouched(true);
          }}
          className={`text-field-input ${isFocused ? "focused" : ""}`}
        />

        {/* Status Icon */}
        {isTouched && !isFocused && (
          <span className={`status-icon ${showError ? "error" : "success"}`}>
            {showError ? <ErrorIcon /> : <SuccessIcon />}
          </span>
        )}

        {rightButton && (
          <button
            type="button"
            className="text-field-right-button"
            onClick={() => {
              onRightButtonClick?.();
              if (!isTouched) setIsTouched(true);
            }}
          >
            {rightButton}
          </button>
        )}

        <label className={`text-field-label ${isFloating ? "floating" : ""}`}>
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>

        {showError && (
          <p className="text-field-error">
            {displayedError}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextField;
