import "./ToggleButton.css";

const ToggleButton = ({ checked, className = "", onClick }) => (
  <span
    className={`toggle-button ${checked ? "true" : ""} ${className || ""}`.trim()} onClick={onClick}
  >
    <span
      className={`toggle-button-circle ${checked ? "true" : ""} ${className || ""}`.trim()}
    >
      {checked && (
        <svg
          rpl=""
          aria-hidden="true"
          fill="currentColor"
          height="12"
          icon-name="checkmark-12"
          viewBox="0 0 12 12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.21 9.95c-.31 0-.61-.12-.85-.35L.58 6.82a.706.706 0 010-.99c.27-.27.72-.27.99 0l2.64 2.64 6.22-6.22c.27-.27.72-.27.99 0s.27.72 0 .99L5.06 9.6c-.23.23-.54.35-.85.35z"></path>
        </svg>
      )}
    </span>
  </span>
);

export default ToggleButton;