import React, { useState } from "react";
import "./CreateCommunity.css";
import ImageCropModal from "./ImageCropModal";
import CloseButton from "../../components/CloseButton";
import CustomButton from "../../components/CustomButton";
import ToggleButton from "../../components/ToggleButton";
import CommunityTypeOption from "../../components/CommunityTypeOption";
import TextField from "../../components/TextField";

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

const CreateCommunity = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedCommunityType, setSelectedCommunityType] = useState("public");
  const [communityMaturity, setCommunityMaturity] = useState("false");
  const [communityName, setCommunityName] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [isNameInvalidPattern, setIsNameInvalidPattern] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [communityDescription, setCommunityDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [iconImageUrl, setIconImageUrl] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageType, setCropImageType] = useState(null); // 'banner' or 'icon'
  const [cropImagePreview, setCropImagePreview] = useState(null);
  const [topicFilter, setTopicFilter] = useState("");

  const totalPages = 4;

  // Check if at least one topic is selected in page 1
  const isNextButtonDisabled =
    (currentPage === 1 && selectedTopics.length === 0) ||
    (currentPage === 3 &&
      (communityName.length < 3 ||
        isNameTaken ||
        isNameInvalidPattern ||
        communityDescription.length === 0));

  // Handle community type selection
  const handleCommunityTypeSelect = (type) => {
    setSelectedCommunityType(type);
  };

  // Handle community maturity selection (toggle)
  const handleCommunityMaturitySelect = () => {
    setCommunityMaturity(communityMaturity === "true" ? "false" : "true");
  };

  // Handle next page navigation
  const handleNext = async () => {
    if (currentPage === 3) {
      setIsNameTouched(true);
      // Don't proceed if validation fails
      if (communityName.length < 3 || isNameTaken || isNameInvalidPattern) {
        // If name is valid length but not checked yet, check it now
        if (communityName.length >= 3 && !isCheckingName) {
          const nameExists = await checkCommunityNameExists(communityName);
          setIsNameTaken(nameExists);
          if (nameExists) {
            return;
          }
        } else {
          return;
        }
      }
    }
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Handle final submission
      console.log("Form submitted");
      // Close modal after submission
      handleClose();
    }
  };

  // Handle close modal
  const handleClose = () => {
    // Reset all form state
    setCurrentPage(1);
    setSelectedTopics([]);
    setSelectedCommunityType("public");
    setCommunityMaturity("false");
    setCommunityName("");
    setIsNameFocused(false);
    setIsNameTouched(false);
    setHasTyped(false);
    setIsNameTaken(false);
    setIsNameInvalidPattern(false);
    setIsCheckingName(false);
    setCommunityDescription("");
    setIsDescriptionFocused(false);
    if (bannerImageUrl) {
      URL.revokeObjectURL(bannerImageUrl);
    }
    setBannerImage(null);
    setBannerImageUrl(null);
    if (iconImageUrl) {
      URL.revokeObjectURL(iconImageUrl);
    }
    setIconImage(null);
    setIconImageUrl(null);
    setTopicFilter("");

    // Call onClose if provided
    if (onClose) {
      onClose();
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      // Close modal on first page
      handleClose();
    }
  };

  // Handle name change
  const handleNameChange = (newValue) => {
    // Remove all spaces from the input
    const valueWithoutSpaces = newValue.replace(/\s/g, '');
    setCommunityName(valueWithoutSpaces);
    setHasTyped(true);
    // Reset name taken error when user types
    if (isNameTaken) {
      setIsNameTaken(false);
    }
    // Validate pattern
    const pattern = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;
    if (valueWithoutSpaces.length > 0) {
      setIsNameInvalidPattern(!pattern.test(valueWithoutSpaces));
    } else {
      setIsNameInvalidPattern(false);
    }
  };

  // Handle name blur
  const handleNameBlur = async () => {
    setIsNameFocused(false);
    if (hasTyped) {
      setIsNameTouched(true);
      // Validate pattern
      const pattern = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;
      if (communityName.length > 0) {
        setIsNameInvalidPattern(!pattern.test(communityName));
      }
      // Check if name is valid length and pattern before checking database
      if (
        communityName.length >= 3 &&
        pattern.test(communityName)
      ) {
        const nameExists = await checkCommunityNameExists(
          communityName
        );
        setIsNameTaken(nameExists);
      }
    }
  };

  // Handle banner image selection
  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropImageType("banner");
      const url = URL.createObjectURL(file);
      setCropImagePreview(url);
      setIsCropModalOpen(true);
    }
  };

  // Handle icon image selection
  const handleIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropImageType("icon");
      const url = URL.createObjectURL(file);
      setCropImagePreview(url);
      setIsCropModalOpen(true);
    }
  };

  // Handle banner image deletion
  const handleBannerImageDelete = () => {
    if (bannerImageUrl) {
      URL.revokeObjectURL(bannerImageUrl);
    }
    setBannerImage(null);
    setBannerImageUrl(null);
  };

  // Handle icon image deletion
  const handleIconImageDelete = () => {
    if (iconImageUrl) {
      URL.revokeObjectURL(iconImageUrl);
    }
    setIconImage(null);
    setIconImageUrl(null);
  };

  // Handle crop modal close
  const handleCropModalClose = () => {
    if (cropImagePreview) {
      URL.revokeObjectURL(cropImagePreview);
    }
    setIsCropModalOpen(false);
    setCropImagePreview(null);
    setCropImageType(null);
  };

  // Handle crop save - receives the cropped file from the modal
  const handleCropSave = (croppedFile) => {
    if (!croppedFile) return;

    const croppedUrl = URL.createObjectURL(croppedFile);

    if (cropImageType === "banner") {
      setBannerImage(croppedFile);
      setBannerImageUrl(croppedUrl);
    } else {
      setIconImage(croppedFile);
      setIconImageUrl(croppedUrl);
    }

    handleCropModalClose();
  };

  // Check if community name already exists in database
  const checkCommunityNameExists = async (name) => {
    if (!name || name.length < 3) {
      return false;
    }

    setIsCheckingName(true);
    try {
      // TODO: Replace with actual API call when backend is implemented
      // Example: const response = await fetch(`/api/communities/check?name=${name}`);
      // const data = await response.json();
      // return data.exists;

      // Placeholder: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For now, return false (name is available)
      // When backend is ready, replace this with actual API call
      return false;
    } catch (error) {
      console.error("Error checking community name:", error);
      return false;
    } finally {
      setIsCheckingName(false);
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
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
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
            {topicCategories.map((category, index) => {
              // Filter topics based on search input
              // Match if search term is at the beginning of a word or is a complete word
              const filteredTopics = category.topics.filter((topic) => {
                if (!topicFilter) return true; // Show all if no filter

                const topicLower = topic.toLowerCase();
                const filterLower = topicFilter.toLowerCase();

                // Check if filter is at the beginning of the topic
                if (topicLower.startsWith(filterLower)) {
                  return true;
                }

                // Check if filter is at the beginning of any word in the topic
                // Split by spaces and check each word
                const words = topicLower.split(/\s+/);
                for (const word of words) {
                  if (word.startsWith(filterLower)) {
                    return true;
                  }
                }

                // Check if filter matches a complete word (word boundary)
                // Use regex to match whole words
                const wordBoundaryRegex = new RegExp(
                  `\\b${filterLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                  "i"
                );
                if (wordBoundaryRegex.test(topic)) {
                  return true;
                }

                return false;
              });

              // Only show category if it has matching topics
              if (filteredTopics.length === 0) {
                return null;
              }

              return (
                <AvailableTopicsSection
                  key={index}
                  title={category.title}
                  topics={filteredTopics}
                  selectedTopics={selectedTopics}
                  onTopicClick={handleTopicClick}
                />
              );
            })}
          </>
        );
      case 2:
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
            icon = {
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
              By continuing, you agree to our Mod Code of Conduct and
              acknowledge that you understand the Reddit Rules.
            </p>
          </div>
        );
      case 3:
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
              {/* <div
                className={`community-name-container ${
                  isNameInvalid ? "invalid" : ""
                } ${isNameFocused ? "focused" : ""}`}
              >
                <label
                  htmlFor="communityNameInput"
                  className={`community-name-label ${
                    isNameFocused || communityName ? "floating" : ""
                  }`}
                >
                  Community name <span className="required-asterisk">*</span>
                </label>
                <div className="community-name-input-wrapper">
                  {communityName && (
                    <span
                      className={`community-name-prefix ${
                        isNameFocused || communityName ? "floating" : ""
                      }`}
                    >
                      r/
                    </span>
                  )}
                  <input
                    type="text"
                    id="communityNameInput"
                    className="community-name-input"
                    value={communityName}
                    maxLength={21}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCommunityName(newValue);
                      setHasTyped(true);
                      // Reset name taken error when user types
                      if (isNameTaken) {
                        setIsNameTaken(false);
                      }
                      // Validate pattern
                      const pattern = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;
                      if (newValue.length > 0) {
                        setIsNameInvalidPattern(!pattern.test(newValue));
                      } else {
                        setIsNameInvalidPattern(false);
                      }
                    }}
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={async () => {
                      setIsNameFocused(false);
                      if (hasTyped) {
                        setIsNameTouched(true);
                        // Validate pattern
                        const pattern = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;
                        if (communityName.length > 0) {
                          setIsNameInvalidPattern(!pattern.test(communityName));
                        }
                        // Check if name is valid length and pattern before checking database
                        if (
                          communityName.length >= 3 &&
                          pattern.test(communityName)
                        ) {
                          const nameExists = await checkCommunityNameExists(
                            communityName
                          );
                          setIsNameTaken(nameExists);
                        }
                      }
                    }}
                  />
                </div>
                {isNameInvalid && (
                  <svg
                    rpl=""
                    className="trailing-icon invalid"
                    fill="currentColor"
                    height="20"
                    icon-name="error-outline"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                  </svg>
                )}
              </div>
              <div className="community-name-footer">
                {(isNameTooShort ||
                  (isNameTouched && !isNameFocused && isNameTaken) ||
                  isNameInvalidPatternError) && (
                  <p className="community-name-error">
                    {isNameTooShort &&
                      "Please lengthen this text to 3 characters or more"}
                    {isNameTouched &&
                      !isNameFocused &&
                      isNameTaken &&
                      `r/${communityName} is already taken`}
                    {isNameInvalidPatternError &&
                      "Only letters, numbers and underscore are allowed"}
                  </p>
                )}
                <span
                  className={`community-name-counter ${
                    isNameInvalid ? "invalid" : ""
                  }`}
                >
                  {Math.min(communityName.length, 21)}/21
                </span>
              </div> */}
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
                containerClassName={`${
                  isNameInvalid ? "invalid" : ""
                } ${isNameFocused ? "focused" : ""}`.trim()}
                labelClassName={
                  isNameFocused || communityName ? "floating" : ""
                }
                prefixClassName={
                  isNameFocused || communityName ? "floating" : ""
                }
                counterClassName={isNameInvalid ? "invalid" : ""}
                errorMessage={
                  isNameTooShort
                    ? "Please lengthen this text to 3 characters or more"
                    : isNameTouched &&
                      !isNameFocused &&
                      isNameTaken
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
                    isDescriptionFocused || communityDescription
                      ? "floating"
                      : ""
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
      case 4:
        return (
          <div className="community-page-content">
            <div className="community-info-container">
              <div className="community-banner-container">
                <span className="community-banner-title">Banner</span>
                <div className="community-banner-controls">
                  <input
                    type="file"
                    id="banner-file-input"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleBannerImageChange}
                  />
                  <CustomButton
                    className="small"
                    onClick={() =>
                      document.getElementById("banner-file-input").click()
                    }
                  >
                    <svg
                      rpl=""
                      fill="currentColor"
                      height="20"
                      icon-name="image"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <path d="M14.6 2H5.4A3.4 3.4 0 002 5.4v9.2A3.4 3.4 0 005.4 18h9.2a3.4 3.4 0 003.4-3.4V5.4A3.4 3.4 0 0014.6 2zM5.4 3.8h9.2c.882 0 1.6.718 1.6 1.6v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.4c0-.882.718-1.6 1.6-1.6zM3.8 14.6v-.567l2.629-2.628a1.59 1.59 0 011.131-.469c.427 0 .829.166 1.131.469l4.795 4.795H5.4c-.882 0-1.6-.718-1.6-1.6zm6.95-7.1a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z"></path>{" "}
                    </svg>
                    {bannerImage ? "Change" : "Add"}
                  </CustomButton>
                  {bannerImage && (
                    <div className="community-image-display">
                      <span className="community-image-filename">
                        {bannerImage.name}
                      </span>
                      <CustomButton
                        className="icon"
                        onClick={handleBannerImageDelete}
                      >
                        <svg
                          rpl=""
                          fill="currentColor"
                          height="16"
                          icon-name="delete"
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.2 15.7c0 .83-.67 1.5-1.5 1.5H6.3c-.83 0-1.5-.67-1.5-1.5V7.6H3v8.1C3 17.52 4.48 19 6.3 19h7.4c1.82 0 3.3-1.48 3.3-3.3V7.6h-1.8v8.1zM17.5 5.8c.5 0 .9-.4.9-.9S18 4 17.5 4h-3.63c-.15-1.68-1.55-3-3.27-3H9.4C7.68 1 6.28 2.32 6.13 4H2.5c-.5 0-.9.4-.9.9s.4.9.9.9h15zM7.93 4c.14-.68.75-1.2 1.47-1.2h1.2c.72 0 1.33.52 1.47 1.2H7.93z"></path>
                        </svg>
                      </CustomButton>
                    </div>
                  )}
                </div>
              </div>
              <div className="community-icon-container">
                <span className="community-icon-title">Icon</span>
                <div className="community-icon-controls">
                  <input
                    type="file"
                    id="icon-file-input"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleIconImageChange}
                  />
                  <CustomButton
                    className="small"
                    onClick={() =>
                      document.getElementById("icon-file-input").click()
                    }
                  >
                    <svg
                      rpl=""
                      fill="currentColor"
                      height="20"
                      icon-name="image"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <path d="M14.6 2H5.4A3.4 3.4 0 002 5.4v9.2A3.4 3.4 0 005.4 18h9.2a3.4 3.4 0 003.4-3.4V5.4A3.4 3.4 0 0014.6 2zM5.4 3.8h9.2c.882 0 1.6.718 1.6 1.6v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.4c0-.882.718-1.6 1.6-1.6zM3.8 14.6v-.567l2.629-2.628a1.59 1.59 0 011.131-.469c.427 0 .829.166 1.131.469l4.795 4.795H5.4c-.882 0-1.6-.718-1.6-1.6zm6.95-7.1a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z"></path>{" "}
                    </svg>
                    {iconImage ? "Change" : "Add"}
                  </CustomButton>
                  {iconImage && (
                    <div className="community-image-display">
                      <span className="community-image-filename">
                        {iconImage.name}
                      </span>
                      <CustomButton
                        className="icon"
                        onClick={handleIconImageDelete}
                      >
                        <svg
                          rpl=""
                          fill="currentColor"
                          height="16"
                          icon-name="delete"
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.2 15.7c0 .83-.67 1.5-1.5 1.5H6.3c-.83 0-1.5-.67-1.5-1.5V7.6H3v8.1C3 17.52 4.48 19 6.3 19h7.4c1.82 0 3.3-1.48 3.3-3.3V7.6h-1.8v8.1zM17.5 5.8c.5 0 .9-.4.9-.9S18 4 17.5 4h-3.63c-.15-1.68-1.55-3-3.27-3H9.4C7.68 1 6.28 2.32 6.13 4H2.5c-.5 0-.9.4-.9.9s.4.9.9.9h15zM7.93 4c.14-.68.75-1.2 1.47-1.2h1.2c.72 0 1.33.52 1.47 1.2H7.93z"></path>
                        </svg>
                      </CustomButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="community-summary-container">
              <div className="community-banner-wrapper">
                {bannerImageUrl && (
                  <img
                    src={bannerImageUrl}
                    alt="Community banner"
                    className="community-banner-image"
                  />
                )}
              </div>
              <div className="community-summary-wrapper">
                <span className="community-icon-wrapper">
                  {iconImageUrl ? (
                    <img
                      src={iconImageUrl}
                      alt="Community icon"
                      className="community-icon-image"
                    />
                  ) : (
                    <svg
                      rpl=""
                      fill="currentColor"
                      className="community-icon-svg"
                      height="48"
                      icon-name="community"
                      viewBox="0 0 20 20"
                      width="48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <path d="M9.633 8.086c-.27 0-.536.066-.799.199a1.665 1.665 0 00-.652.596c-.173.265-.258.581-.258.948v3.961H5.999V6.321h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.547 2.547 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.091l-.774 1.848a.766.766 0 00-.244-.073 1.873 1.873 0 00-.349-.032l.001.001zM19 10a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9zm-1.8 0a7.17 7.17 0 00-1.661-4.594L11.98 13.79h-1.955l4.108-9.677A7.152 7.152 0 0010 2.8c-3.97 0-7.2 3.23-7.2 7.2s3.23 7.2 7.2 7.2 7.2-3.23 7.2-7.2z"></path>{" "}
                    </svg>
                  )}
                </span>
                <div className="community-summary-data">
                  <span className="community-summary-name">
                    r/
                    {communityName.length > 0 ? communityName : "communityname"}
                  </span>
                  <span className="community-summary-stats">
                    1 weekly visitor · 1 weekly contributor
                  </span>
                </div>
              </div>
              <span className="community-summary-description">
                {communityDescription.length > 0
                  ? communityDescription
                  : "Your community description"}
              </span>
            </div>
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
          <CloseButton onClick={handleClose} />
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
            <CustomButton onClick={handleCancel}>
              {currentPage > 1 ? "Back" : "Cancel"}
            </CustomButton>
          </div>
          <div className="button-container">
            <CustomButton
              disabled={isNextButtonDisabled}
              onClick={handleNext}
              className="blue-button"
            >
              {currentPage === totalPages ? "Create Community" : "Next"}
            </CustomButton>
          </div>
        </div>
      </div>
      {isCropModalOpen && cropImagePreview && cropImageType && (
        <ImageCropModal
          imageUrl={cropImagePreview}
          imageType={cropImageType}
          onClose={handleCropModalClose}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
};

export default CreateCommunity;
