import "./CommunityInfoPage.css";
import TextField from "../../../components/TextField";

const CommunityInfoPage = ({
  communityName,
  isNameFocused,
  setIsNameFocused,
  isNameTouched,
  isNameTaken,
  isNameInvalidPattern,
  handleNameChange,
  handleNameBlur,
  communityDescription,
  setCommunityDescription,
  isDescriptionFocused,
  setIsDescriptionFocused,
}) => {
  const isNameTooShort =
    isNameTouched && !isNameFocused && communityName.length < 3;
  const isNameInvalidPatternError =
    isNameTouched && !isNameFocused && isNameInvalidPattern;
  const isNameInvalid =
    isNameTooShort ||
    (isNameTouched && !isNameFocused && isNameTaken) ||
    isNameInvalidPatternError;
  return (
    <div className="community-page-content">
      <div className="community-info-container">
        <TextField
          label="Community name"
          value={communityName}
          maxLength={21}
          onChange={handleNameChange}
          onFocus={() => setIsNameFocused(true)}
          onBlur={handleNameBlur}
          prefix="r/"
          showPrefix={!!communityName}
          required={true}
          id="communityNameInput"
          containerClassName={`${isNameInvalid ? "invalid" : ""} ${
            isNameFocused ? "focused" : ""
          }`.trim()}
          labelClassName={isNameFocused || communityName ? "floating" : ""}
          prefixClassName={isNameFocused || communityName ? "floating" : ""}
          counterClassName={isNameInvalid ? "invalid" : ""}
          errorMessage={
            isNameTooShort
              ? "Please lengthen this text to 3 characters or more"
              : isNameTouched && !isNameFocused && isNameTaken
              ? `r/${communityName} is already taken`
              : isNameInvalidPatternError
              ? "Only letters, numbers and underscore are allowed"
              : null
          }
          showErrorIcon={isNameInvalid && isNameTouched && !isNameFocused}
          counterText={`${Math.min(communityName.length, 21)}/21`}
          pattern="^[A-Za-z0-9][A-Za-z0-9_]{2,20}$"
        />
        <div className="community-description-container">
          <label
            htmlFor="communityDescriptionInput"
            className={`community-description-label ${
              isDescriptionFocused || communityDescription ? "floating" : ""
            }`}
          >
            Description <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="communityDescriptionInput"
            className="community-description-input"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
          />
        </div>
        <span className={`community-description-counter`}>
          {communityDescription.length}
        </span>
      </div>
      <div className="community-summary-container">
        <span className="community-summary-name">
          r/{communityName.length > 0 ? communityName : "communityname"}
        </span>
        <span className="community-summary-stats">
          1 weekly visitor · 1 weekly contributor
        </span>
        <span className="community-summary-description">
          {communityDescription.length > 0
            ? communityDescription
            : "Your community description"}
        </span>
      </div>
    </div>
  );
};

export default CommunityInfoPage;
