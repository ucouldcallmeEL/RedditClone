import React from "react";

const Button = ({ icon, alt, label, onClick, disabled }) => {
  return (
    <div
      className={`LogIn-button ${disabled ? "disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
    >
      {icon && <img className="logo" src={icon} alt={alt} width="20" />}
      <span className="LogIn-button-text">{label}</span>
    </div>
  );
};

export default Button;
