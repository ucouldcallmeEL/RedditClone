import './CustomButton.css';

const CustomButton = ({ children, onClick, disabled = false, className = "", type = "button"}) => (
  <button className={`custom-button ${className || ""}`.trim()} onClick={onClick} disabled={disabled} type={type}>
    {children}
  </button> 
);

export default CustomButton;