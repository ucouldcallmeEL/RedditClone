import "./CommunityTypeOption.css";

const CommunityTypeOption = ({ icon, name, description, checked, onClick }) => (
    <div
    className={`community-type-container ${
      checked ? "selected" : ""
    }`}
    onClick={onClick}
  >
    {icon}
    <div className="community-type-details">
      <span className="community-type-name">{name}</span>
      <p className="community-type-description">{description}</p>
    </div>
    {checked ? (
      <svg
        rpl=""
        fill="currentColor"
        className="community-type-radio-button-selected"
        height="16"
        icon-name="radio-button-fill"
        viewBox="0 0 20 20"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1z"></path>
        <path d="M10 14a4 4 0 100-8 4 4 0 000 8z"></path>
      </svg>
    ) : (
      <svg
        rpl=""
        fill="currentColor"
        className="community-type-radio-button-unselected"
        height="16"
        icon-name="radio-button-outline"
        viewBox="0 0 20 20"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1z"></path>
      </svg>
    )}
  </div>
);

export default CommunityTypeOption;