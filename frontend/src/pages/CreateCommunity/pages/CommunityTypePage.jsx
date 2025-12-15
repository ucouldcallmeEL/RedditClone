import "./CommunityTypePage.css";
import CommunityTypeOption from "../../../components/CommunityTypeOption";
import ToggleButton from "../../../components/ToggleButton";

const CommunityTypePage = ({
  selectedCommunityType,
  handleCommunityTypeSelect,
  communityMaturity,
  handleCommunityMaturitySelect,
}) => {
  return (
    <div>
      <CommunityTypeOption
        icon={
          <svg
            rpl=""
            fill="currentColor"
            height="20"
            className="community-type-icon"
            icon-name="browser-fill"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 1c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9zm7.2 9c0 .27-.02.54-.05.8h-2.97c-.1 2.33-.63 4.38-1.41 5.84-.75.31-1.56.5-2.42.54.87-.53 2.06-2.85 2.22-6.38H7.41c.16 3.54 1.35 5.85 2.22 6.38a7 7 0 01-2.42-.54c-.78-1.46-1.31-3.52-1.41-5.84H2.83c-.03-.26-.05-.53-.05-.8s.02-.54.05-.8H5.8c.1-2.33.63-4.38 1.41-5.84.75-.31 1.56-.5 2.42-.54-.87.53-2.06 2.85-2.22 6.38h5.16c-.16-3.54-1.35-5.85-2.22-6.38a7 7 0 012.42.54c.78 1.46 1.31 3.52 1.41 5.84h2.97c.03.26.05.53.05.8z"></path>
          </svg>
        }
        name="Public"
        description="Anyone can view, post, and comment to this community"
        checked={selectedCommunityType === "public"}
        onClick={() => handleCommunityTypeSelect("public")}
      />
      <CommunityTypeOption
        icon={
          <svg
            rpl=""
            fill="currentColor"
            height="20"
            icon-name="show-fill"
            className="community-type-icon"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.08 8.47C17.28 5.11 13.8 3.03 10 3.03S2.72 5.11.92 8.47c-.51.96-.51 2.1 0 3.06 1.8 3.36 5.28 5.44 9.08 5.44s7.28-2.09 9.08-5.44c.51-.96.51-2.1 0-3.06zM10 13.25c-1.79 0-3.25-1.46-3.25-3.25S8.21 6.75 10 6.75s3.25 1.46 3.25 3.25-1.46 3.25-3.25 3.25z"></path>
          </svg>
        }
        name="Restricted"
        description="Anyone can view, but only approved users can contribute"
        checked={selectedCommunityType === "restricted"}
        onClick={() => handleCommunityTypeSelect("restricted")}
      />
      <CommunityTypeOption
        icon={
          <svg
            rpl=""
            fill="currentColor"
            height="20"
            className="community-type-icon"
            icon-name="lock-fill"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <path d="M15.993 8.168h-.429V6.61a5.572 5.572 0 00-5.566-5.566A5.572 5.572 0 004.432 6.61v1.558h-.429a2.005 2.005 0 00-2.005 2.005v3.692a5.054 5.054 0 005.054 5.054h5.892a5.054 5.054 0 005.054-5.054v-3.692a2.005 2.005 0 00-2.005-2.005zM10.998 15h-2v-3h2v3zm2.767-6.832H6.232V6.61A3.771 3.771 0 0110 2.844a3.77 3.77 0 013.767 3.766l-.001 1.558z"></path>{" "}
          </svg>
        }
        name="Private"
        description="Only approved users can view and contribute"
        checked={selectedCommunityType === "private"}
        onClick={() => handleCommunityTypeSelect("private")}
      />
      <div className="community-type-divider"></div>
      <div
        className={`community-maturity-container ${
          communityMaturity === "true" ? "selected" : ""
        }`}
        onClick={handleCommunityMaturitySelect}
      >
        <svg
          rpl=""
          fill="currentColor"
          className="community-maturity-icon"
          height="20"
          icon-name="nsfw"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 19a3.29 3.29 0 01-2.333-.965l-5.702-5.702a3.304 3.304 0 010-4.666l5.701-5.702a3.303 3.303 0 014.668 0l5.701 5.702a3.304 3.304 0 010 4.666l-5.701 5.702A3.292 3.292 0 019.998 19H10zm0-16.2c-.383 0-.768.145-1.06.437L3.24 8.94a1.502 1.502 0 000 2.122l5.702 5.702a1.501 1.501 0 002.12 0l5.703-5.702a1.502 1.502 0 000-2.122l-5.702-5.702a1.496 1.496 0 00-1.06-.438H10zM5.834 7.74l-.029.013v1.44l1.23-.545v4.64H8.57V6.711h-.476L5.833 7.74v.001zm8.33 2.751a1.994 1.994 0 00-.665-.638 1.846 1.846 0 00.615-1.381c0-.364-.096-.688-.285-.964a1.884 1.884 0 00-.768-.643 2.45 2.45 0 00-1.05-.227c-.377 0-.73.075-1.051.224a1.906 1.906 0 00-.775.641 1.65 1.65 0 00-.292.965c0 .28.059.545.176.791.107.226.255.425.439.594a1.973 1.973 0 00-.665.641A1.708 1.708 0 009.89 12.4c.21.296.503.533.87.704.367.171.784.257 1.242.257.45 0 .865-.085 1.23-.252a2.15 2.15 0 00.873-.7c.212-.298.319-.634.319-1 0-.333-.088-.642-.264-.917h.003zm-1.338 1.236a.844.844 0 01-.336.282c-.147.07-.305.105-.482.105-.175 0-.335-.034-.48-.1a.836.836 0 01-.342-.279.68.68 0 01-.126-.402.7.7 0 01.123-.405.851.851 0 01.335-.293c.145-.072.31-.109.49-.109.183 0 .347.037.486.11a.83.83 0 01.332.292.72.72 0 010 .8zm-.131-2.757a.733.733 0 01-.284.272.823.823 0 01-.403.1.834.834 0 01-.406-.1.743.743 0 01-.284-1.029.698.698 0 01.285-.257.888.888 0 01.403-.092c.147 0 .284.031.404.092.121.06.214.144.284.256a.708.708 0 01.103.376.743.743 0 01-.103.383z"></path>
        </svg>
        <div className="community-maturity-details">
          <span className="community-maturity-heading">Mature (18+)</span>
          <p className="community-type-description">
            Only approved users can view and contribute
          </p>
        </div>
        <ToggleButton
          checked={communityMaturity === "true"}
          onClick={handleCommunityMaturitySelect}
        />
      </div>
      <p className="reddit-rules-text">
        By continuing, you agree to our Mod Code of Conduct and acknowledge that
        you understand the Reddit Rules.
      </p>
    </div>
  );
};

export default CommunityTypePage;
