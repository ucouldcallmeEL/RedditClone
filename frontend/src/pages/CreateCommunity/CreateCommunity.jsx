import React, { useState } from "react";
import "./CreateCommunity.css";
import CloseButton from "../../components/CloseButton";
import CustomButton from "../../components/CustomButton";
import SelectTopicsPage from "./pages/SelectTopicsPage";
import CommunityTypePage from "./pages/CommunityTypePage";
import CommunityInfoPage from "./pages/CommunityInfoPage";
import StyleCommunityPage from "./pages/StyleCommunityPage";
import { communityRoutes, apiPost, apiGet } from "../../config/apiRoutes";

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
      const success = await handleCreateCommunity();
      if (success) {
        // Close modal after successful submission
        handleClose();
      }
    }
  };

  // Handle create community
  const handleCreateCommunity = async () => {
    try {
      // Build community data object
      const communityData = {
        name: communityName,
        description: communityDescription,
        profilePicture: iconImageUrl || "", // Icon is profile picture
        coverPicture: bannerImageUrl || "", // Banner is cover picture
        members: [], // Will be populated by backend from authenticated user
        moderators: [], // Will be populated by backend from authenticated user
        topics: selectedTopics,
        type: selectedCommunityType,
        isNSFW: communityMaturity === "true" // Convert string to boolean
      };

      // Call backend API using centralized route
      const response = await apiPost(communityRoutes.create, communityData);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create community:", errorData.error || "Unknown error");
        // TODO: Show error message to user (e.g., using a toast notification)
        return false;
      }

      const createdCommunity = await response.json();
      console.log("Community created successfully:", createdCommunity);
      return true;
    } catch (error) {
      console.error("Error creating community:", error);
      // TODO: Show error message to user
      return false;
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
    const valueWithoutSpaces = newValue.replace(/\s/g, "");
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
      if (communityName.length >= 3 && pattern.test(communityName)) {
        const nameExists = await checkCommunityNameExists(communityName);
        setIsNameTaken(nameExists);
      }
    }
  };

  // Handle banner image save (callback from StyleCommunityPage)
  const handleBannerImageSave = (croppedFile, croppedUrl) => {
    setBannerImage(croppedFile);
    setBannerImageUrl(croppedUrl);
  };

  // Handle icon image save (callback from StyleCommunityPage)
  const handleIconImageSave = (croppedFile, croppedUrl) => {
    setIconImage(croppedFile);
    setIconImageUrl(croppedUrl);
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

  // Check if community name already exists in database (calls backend)
  const checkCommunityNameExists = async (name) => {
    if (!name || name.length < 3) {
      return false;
    }

    setIsCheckingName(true);
    try {
      // Use centralized route for checking community name
      const response = await apiGet(communityRoutes.checkName(name));

      if (response.ok) {
        // Backend returns 200 + true when community exists
        const data = await response.json();
        // If backend sends { exists: true } change this accordingly
        return data === true || data.exists === true;
      }

      // 404 = not found = name is available
      if (response.status === 404) {
        return false;
      }

      // Any other status -> treat as "don't block creation" but log it
      console.error("Unexpected response checking community name:", response);
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

  // // Render 
  
  // Page configurations
  const pages = [
    {
      component: SelectTopicsPage,
      props: {
        topicCategories,
        selectedTopics,
        handleRemoveTopic,
        handleTopicClick,
        topicFilter,
        setTopicFilter,
      },
      title: "Add topics",
      description: "Add up to 3 topics to help interested redditors find your community.",
    },
    {
      component: CommunityTypePage,
      props: {
        selectedCommunityType,
        handleCommunityTypeSelect,
        communityMaturity,
        handleCommunityMaturitySelect,
      },
      title: "What kind of community is this?",
      description: (
        <>
          Decide who can view and contribute in your community. Only public
          communities show up in search. <strong>Important:</strong> Once
          set, you will need to submit a request to change your community
          type.
        </>
      ),
    },
    {
      component: CommunityInfoPage,
      props: {
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
      },
      title: "Tell us about your community",
      description:
        "A name and description help people understand what your community is all about.",
    },
    {
      component: StyleCommunityPage,
      props: {
        bannerImage,
        bannerImageUrl,
        iconImage,
        iconImageUrl,
        communityName,
        communityDescription,
        onBannerImageSave: handleBannerImageSave,
        onIconImageSave: handleIconImageSave,
        onBannerImageDelete: handleBannerImageDelete,
        onIconImageDelete: handleIconImageDelete,
      },
      title: "Style your community",
      description:
        "Adding visual flair will catch new members attention and help establish your community's culture! You can update this at any time.",
    },
  ];

  // Get current page configuration
  const currentPageConfig = pages[currentPage - 1] || {
    component: null,
    props: {},
    title: "Create Community",
    description: "",
  };

  // Render page content
  const renderPageContent = () => {
    const PageComponent = currentPageConfig.component;
    if (!PageComponent) return null;
    return <PageComponent {...currentPageConfig.props} />;
  };


  // const pageHeader = getPageHeader();
  const pageHeader = {
    title: currentPageConfig.title,
    description: currentPageConfig.description,
  };

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
    </div>
  );
};

export default CreateCommunity;
