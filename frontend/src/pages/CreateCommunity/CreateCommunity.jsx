import React, { useState } from "react";
import "./CreateCommunity.css";

// Reusable component for available topics section
const AvailableTopicsSection = ({
  title,
  topics,
  selectedTopics,
  onTopicClick,
}) => {
  // Check if a topic is selected
  const isTopicSelected = (topicName) => {
    return selectedTopics.includes(topicName);
  };

  return (
    <div className="available-topics-container">
      <p className="available-topics-title">{title}</p>
      <div className="available-topics-list">
        {topics.map((topic) => (
          <div key={topic} className="available-topic">
            <button
              className={`available-topic-name ${
                isTopicSelected(topic) ? "selected" : ""
              }`}
              onClick={() => onTopicClick(topic)}
            >
              <span>{topic}</span>
              {isTopicSelected(topic) && (
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  height="16"
                  viewBox="0 0 20 20"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  className="remove-topic-icon"
                >
                  <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm3.94 11.66l-1.27 1.27-2.66-2.66-2.66 2.66-1.27-1.27L8.74 10 6.08 7.34l1.27-1.27 2.66 2.66 2.66-2.66 1.27 1.27L11.28 10l2.66 2.66z"></path>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateCommunity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedCommunityType, setSelectedCommunityType] = useState("public");
  const [communityMaturity, setCommunityMaturity] = useState("false");

  const totalPages = 4;

  // Check if at least one topic is selected in page 1
  const isNextButtonDisabled = currentPage === 1 && selectedTopics.length === 0;

  // Handle community type selection
  const handleCommunityTypeSelect = (type) => {
    setSelectedCommunityType(type);
  };

  // Handle community maturity selection (toggle)
  const handleCommunityMaturitySelect = () => {
    setCommunityMaturity(communityMaturity === "true" ? "false" : "true");
  };

  // Handle next page navigation
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Handle final submission
      console.log("Form submitted");
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      // Close modal or reset
      console.log("Modal closed");
    }
  };

  // Available topics organized by category
  const topicCategories = [
    {
      title: "Entertainment",
      topics: ["Anime & Manga", "Cosplay", "Movies", "TV Shows"],
    },
    {
      title: "Gaming",
      topics: ["Video Games", "Board Games", "Esports"],
    },
  ];

  // Check if a topic is selected
  const isTopicSelected = (topicName) => {
    return selectedTopics.includes(topicName);
  };

  // Handle topic selection/deselection
  const handleTopicClick = (topicName) => {
    if (isTopicSelected(topicName)) {
      // Remove topic if already selected
      setSelectedTopics(selectedTopics.filter((topic) => topic !== topicName));
    } else {
      // Add topic if not selected and limit is not reached
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, topicName]);
      }
    }
  };

  // Handle removing a topic from selected list
  const handleRemoveTopic = (topicName) => {
    setSelectedTopics(selectedTopics.filter((topic) => topic !== topicName));
  };

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div className="search-container">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                viewBox="0 0 20 20"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
              >
                <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z"></path>
              </svg>
              <input
                type="text"
                name="filter"
                className="search-input"
                placeholder="Filter topics"
              />
            </div>
            <h3>Topics {selectedTopics.length}/3</h3>
            <div className="selected-topics-container">
              {selectedTopics.map((topic) => (
                <div key={topic} className="selected-topic">
                  <span className="selected-topic-name">{topic}</span>
                  <button
                    className="remove-topic-button"
                    onClick={() => handleRemoveTopic(topic)}
                  >
                    <svg
                      aria-hidden="true"
                      fill="currentColor"
                      height="16"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      className="remove-topic-icon"
                    >
                      <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm3.94 11.66l-1.27 1.27-2.66-2.66-2.66 2.66-1.27-1.27L8.74 10 6.08 7.34l1.27-1.27 2.66 2.66 2.66-2.66 1.27 1.27L11.28 10l2.66 2.66z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {topicCategories.map((category, index) => (
              <AvailableTopicsSection
                key={index}
                title={category.title}
                topics={category.topics}
                selectedTopics={selectedTopics}
                onTopicClick={handleTopicClick}
              />
            ))}
          </>
        );
      case 2:
        return (
          <div>
            <div
              className={`community-type-container ${
                selectedCommunityType === "public" ? "selected" : ""
              }`}
              onClick={() => handleCommunityTypeSelect("public")}
            >
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
              <div className="community-type-details">
                <span className="community-type-name">Public</span>
                <p className="community-type-description">
                  Anyone can view, post, and comment to this community
                </p>
              </div>
              {selectedCommunityType === "public" ? (
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
            <div
              className={`community-type-container ${
                selectedCommunityType === "restricted" ? "selected" : ""
              }`}
              onClick={() => handleCommunityTypeSelect("restricted")}
            >
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
              <div className="community-type-details">
                <span className="community-type-name">Restricted</span>
                <p className="community-type-description">
                  Anyone can view, but only approved users can contribute
                </p>
              </div>
              {selectedCommunityType === "restricted" ? (
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
            <div
              className={`community-type-container ${
                selectedCommunityType === "private" ? "selected" : ""
              }`}
              onClick={() => handleCommunityTypeSelect("private")}
            >
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
              <div className="community-type-details">
                <span className="community-type-name">Private</span>
                <p className="community-type-description">
                  Only approved users can view and contribute
                </p>
              </div>
              {selectedCommunityType === "private" ? (
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
              <span className={`switch-button ${
                communityMaturity === "true" ? "true" : ""
              }`}>
                <span className={`button-circle ${
                  communityMaturity === "true" ? "true" : ""
                }`}>
                  {communityMaturity === "true" && (
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
            </div>
            <p className="reddit-rules-text">
              By continuing, you agree to our Mod Code of Conduct and acknowledge that you understand the Reddit Rules.
            </p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Page 3 Content</h3>
            <p>This is page 3</p>
          </div>
        );
      case 4:
        return (
          <div>
            <h3>Page 4 Content</h3>
            <p>This is page 4</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Get page title and description
  const getPageHeader = () => {
    switch (currentPage) {
      case 1:
        return {
          title: "Add topics",
          description:
            "Add up to 3 topics to help interested redditors find your community.",
        };
      case 2:
        return {
          title: "What kind of community is this?",
          description: (
            <>
              Decide who can view and contribute in your community. Only public
              communities show up in search. <strong>Important:</strong> Once
              set, you will need to submit a request to change your community
              type.
            </>
          ),
        };
      case 3:
        return {
          title: "Tell us about your community",
          description:
            "A name and description help people understand what your community is all about.",
        };
      case 4:
        return {
          title: "Style your community",
          description:
            "Adding visual flair will catch new members attention and help establish your community’s culture! You can update this at any time.",
        };
      default:
        return {
          title: "Create Community",
          description: "",
        };
    }
  };

  const pageHeader = getPageHeader();

  return (
    <div className="modal-container">
      <div className="modal-header">
        <div className="description-container">
          <h2>{pageHeader.title}</h2>
          <p className="description-text">{pageHeader.description}</p>
        </div>

        <div className="button-container">
          <button className="close-button">
            <svg
              fill="currentColor"
              height="16"
              viewBox="0 0 20 20"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="close-icon"
            >
              <path d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="modal-body">{renderPageContent()}</div>
      <div className="modal-footer">
        <div className="progress-dots-container">
          {[...Array(totalPages)].map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${
                currentPage === index + 1 ? "current-page-indicator" : ""
              }`}
            ></div>
          ))}
        </div>
        <div className="footer-buttons-container">
          <div className="button-container">
            <button className="cancel-button" onClick={handleCancel}>
              {currentPage > 1 ? "Back" : "Cancel"}
            </button>
          </div>
          <div className="button-container">
            <button
              className="next-button"
              disabled={isNextButtonDisabled}
              onClick={handleNext}
            >
              {currentPage === totalPages ? "Create Community" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
