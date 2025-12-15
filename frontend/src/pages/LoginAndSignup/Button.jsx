import React from "react";

const Button = ({
  icon,
  alt,
  label,
  onClick,
  disabled,
  className = "",
}) => {
  return (
    <div
      className={`LogIn-button ${disabled ? "disabled" : ""} ${
        className || ""
      }`.trim()}
      onClick={!disabled ? onClick : undefined}
    >
      {icon && <img className="logo" src={icon} alt={alt} width="20" />}
      <span
        className={`log-in-button-text ${
          disabled ? "disabled" : ""
        }`.trim()}
      >
        {label}
      </span>
    </div>
  );
};

export default Button;
