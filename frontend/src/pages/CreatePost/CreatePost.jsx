import React, { useState } from "react";
import "./CreatePost.css";
import CloseButton from "../../components/CloseButton";
import ToggleButton from "../../components/ToggleButton";
import CustomButton from "../../components/CustomButton";
import TextField from "../../components/TextField";
import TextArea from "../../components/TextArea";

// Placeholder components for external components
const HeaderBar = () => {
  return <div className="header-bar-placeholder"></div>;
};

const Sidebar = () => {
  return <div className="sidebar-placeholder"></div>;
};

const CreatePost = ({ onNavigateHome }) => {
  const [selectedPostType, setSelectedPostType] = useState("text");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [activeToolbarButtons, setActiveToolbarButtons] = useState({});
  const [isLinkInvalidFormat, setIsLinkInvalidFormat] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [postLink, setPostLink] = useState("");
  const [isLinkFocused, setIsLinkFocused] = useState(false);
  const [isLinkTouched, setIsLinkTouched] = useState(false);
  const [hasTypedLink, setHasTypedLink] = useState(false);
  const [showCommunitySearch, setShowCommunitySearch] = useState(false);
  const [communitySearch, setCommunitySearch] = useState("");
  const [selectedCommunityOption, setSelectedCommunityOption] = useState(null);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    nsfw: false,
    spoiler: false,
    brand: false,
  });
  const [tempTags, setTempTags] = useState({
    nsfw: false,
    spoiler: false,
    brand: false,
  });

  const isCommunitySelected = Boolean(selectedCommunityOption);

  const communityOptions = [
    {
      id: "account",
      label: "u/malakmwagdy",
      members: "Your profile",
      type: "account",
    },
    {
      id: "PS5",
      label: "r/PS5",
      members: "8,062,490 members",
      subscribed: "Subscribed",
      type: "community",
    },
    {
      id: "ExampleCommunity",
      label: "r/ExampleCommunity",
      members: "120,000 members",
      subscribed: "Subscribed",
      type: "community",
    },
    {
      id: "YourCommunity1",
      label: "r/YourCommunity1",
      members: "54,321 members",
      subscribed: "",
      type: "community",
    },
  ];

  const postTypes = [
    { id: "text", label: "Text" },
    { id: "images", label: "Images & Video" },
    { id: "link", label: "Link" },
    { id: "poll", label: "Poll" },
  ];

  const handlePostTypeChange = (type) => {
    setSelectedPostType(type);
  };

  const handleSelectCommunity = (option) => {
    setSelectedCommunity(option.label);
    setSelectedCommunityOption(option);
    setShowCommunitySearch(false);
    setCommunitySearch("");
  };

  const filteredCommunities = communityOptions.filter((option) => {
    const searchLower = communitySearch.trim().toLowerCase();
    const communityLower = option.id.toLowerCase();

    // No search: show account and subscribed communities only
    if (!searchLower) {
      if (option.type === "account") return true;
      return Boolean(option.subscribed);
    }

    // With search: allow any community/account that matches
    if (communityLower.startsWith(searchLower)) return true;
    const words = communityLower.split(/\s+/);
    return words.some((word) => word.startsWith(searchLower));
  });

  const handleToolbarButtonClick = (e) => {
    const buttonId = e.currentTarget.dataset.toolbarButton;
    setActiveToolbarButtons((prev) => ({
      ...prev,
      [buttonId]: !prev[buttonId],
    }));
  };

  // Handle media upload
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedMedia(files);
    }
  };

  const handleToggleTag = (tagKey) => {
    setTempTags((prev) => ({ ...prev, [tagKey]: !prev[tagKey] }));
  };

  const handleOpenTagsModal = () => {
    setTempTags({ ...selectedTags });
    setShowTagsModal(true);
  };

  const handleAddTags = () => {
    setSelectedTags({ ...tempTags });
    setShowTagsModal(false);
  };

  const handleCancelTags = () => {
    setShowTagsModal(false);
  };

  // Validation function to check if form is valid based on post type
  const isFormValid = () => {
    // Title must always be filled (length > 0)
    const isTitleFilled = postTitle.length > 0;

    // Title has no errors (not empty when touched, and for links, format is valid)
    const hasTitleErrors =
      (isTitleTouched && !isTitleFocused && postTitle.length === 0) ||
      (selectedPostType === "link" && isLinkInvalidFormat);

    if (selectedPostType === "text") {
      // Text posts: only need filled title with no errors
      return isTitleFilled && !hasTitleErrors;
    } else if (selectedPostType === "images") {
      // Image/Video posts: need filled title with no errors AND uploaded media
      return isTitleFilled && !hasTitleErrors && uploadedMedia.length > 0;
    } else if (selectedPostType === "link") {
      // Link posts: need filled link AND valid link format (no format errors)
      const isLinkFilled = postLink.length > 0;
      const hasLinkErrors =
        (isLinkTouched && !isLinkFocused && postLink.length === 0) ||
        isLinkInvalidFormat;
      return isLinkFilled && !hasLinkErrors;
    }
    // Poll posts: buttons are hidden, so return false
    return false;
  };

  return (
    <div className="create-post-page">
      <HeaderBar />
      <div className="create-post-layout">
        <Sidebar />
        <div className="create-post-main-content">
          <div className="create-post-container">
            <div className="create-post-header">
              <h1 className="create-post-title">Create post</h1>
              <span className="create-post-drafts">Drafts</span>
            </div>

            <div className="create-post-community-selector">
              {!showCommunitySearch ? (
                <button
                  className="community-select-dropdown"
                  onClick={() => setShowCommunitySearch(true)}
                >
                  <span className="community-select-avatar">
                    {selectedCommunityOption?.imageUrl ? (
                      <img
                        src={selectedCommunityOption.imageUrl}
                        alt={`${selectedCommunityOption.label} avatar`}
                        className="community-select-avatar-img"
                      />
                    ) : selectedCommunityOption?.type === "account" ? (
                      <img
                        src="/avatar_default.png"
                        alt="User Avatar"
                        className="community-select-avatar-img"
                      />
                    ) : selectedCommunityOption ? (
                      <svg
                        rpl=""
                        fill="currentColor"
                        height="20"
                        icon-name="community-fill"
                        viewBox="0 0 20 20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.977 13.79h-1.955l4.549-10.715a.81.81 0 00-.381-1.032C12.447 1.12 10.37.747 8.179 1.18c-3.612.716-6.471 3.68-7.059 7.316a9.01 9.01 0 0010.409 10.377c3.735-.616 6.741-3.635 7.347-7.371.453-2.8-.388-5.405-2.017-7.322a.505.505 0 00-.853.119l-4.029 9.49zM9.98 8.118a1.752 1.752 0 00-1.148.167 1.664 1.664 0 00-.651.596 1.703 1.703 0 00-.258.948v3.96H5.998V6.322h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.55 2.55 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.09l-.774 1.849a.766.766 0 00-.244-.073z"></path>
                      </svg>
                    ) : (
                      <svg
                        rpl=""
                        fill="currentColor"
                        height="24"
                        icon-name="community-fill"
                        viewBox="0 0 20 20"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.977 13.79h-1.955l4.549-10.715a.81.81 0 00-.381-1.032C12.447 1.12 10.37.747 8.179 1.18c-3.612.716-6.471 3.68-7.059 7.316a9.01 9.01 0 0010.409 10.377c3.735-.616 6.741-3.635 7.347-7.371.453-2.8-.388-5.405-2.017-7.322a.505.505 0 00-.853.119l-4.029 9.49zM9.98 8.118a1.752 1.752 0 00-1.148.167 1.664 1.664 0 00-.651.596 1.703 1.703 0 00-.258.948v3.96H5.998V6.322h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.55 2.55 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.09l-.774 1.849a.766.766 0 00-.244-.073z"></path>
                      </svg>
                    )}
                  </span>
                  <span className="community-select-label">
                    {selectedCommunityOption?.label || "Select a community"}
                  </span>
                  <svg
                    rpl=""
                    className="ml-xs"
                    fill="currentColor"
                    height="20"
                    icon-name="caret-down"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>{" "}
                  </svg>
                </button>
              ) : (
                <div className="community-search-wrapper">
                  <div className="community-search">
                    <div className="community-search-bar">
                      <svg
                        aria-hidden="true"
                        fill="currentColor"
                        height="18"
                        viewBox="0 0 20 20"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                        className="search-icon"
                      >
                        <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z"></path>
                      </svg>
                      <input
                        type="text"
                        name="community-filter"
                        className="community-search-input"
                        placeholder="Select a community"
                        value={communitySearch}
                        onChange={(e) => setCommunitySearch(e.target.value)}
                        autoFocus
                        onBlur={() => {
                          // Allow click on results before closing
                          setTimeout(() => setShowCommunitySearch(false), 100);
                        }}
                      />
                      <button
                        className="community-search-clear-button"
                        onClick={() => setCommunitySearch("")}
                        type="button"
                      >
                        <svg
                          rpl=""
                          fill="currentColor"
                          className="community-search-clear-icon"
                          height="16"
                          icon-name="clear"
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm0 16.2c-3.97 0-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                          <path d="M12.66 6.06L10 8.73 7.34 6.06 6.06 7.34 8.73 10l-2.67 2.66 1.28 1.28L10 11.27l2.66 2.67 1.28-1.28L11.27 10l2.67-2.66-1.28-1.28z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="community-search-list">
                    {filteredCommunities.length === 0 ? (
                      <div className="community-search-empty">No matches</div>
                    ) : (
                      filteredCommunities.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className="community-search-item"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectCommunity(option);
                          }}
                        >
                          <div
                            className={`community-avatar ${
                              option.type === "account"
                                ? "avatar-account"
                                : "avatar-community"
                            }`}
                          >
                            {option.imageUrl ? (
                              <img
                                src={option.imageUrl}
                                alt={`${option.label} avatar`}
                                className="community-avatar-img"
                              />
                            ) : option.type === "account" ? (
                              <img
                                src="/avatar_default.png"
                                alt="User Avatar"
                                className="community-avatar-img"
                              />
                            ) : (
                              <svg
                                rpl=""
                                fill="currentColor"
                                className="community-default-icon"
                                height="24"
                                icon-name="community-fill"
                                viewBox="0 0 20 20"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M11.977 13.79h-1.955l4.549-10.715a.81.81 0 00-.381-1.032C12.447 1.12 10.37.747 8.179 1.18c-3.612.716-6.471 3.68-7.059 7.316a9.01 9.01 0 0010.409 10.377c3.735-.616 6.741-3.635 7.347-7.371.453-2.8-.388-5.405-2.017-7.322a.505.505 0 00-.853.119l-4.029 9.49zM9.98 8.118a1.752 1.752 0 00-1.148.167 1.664 1.664 0 00-.651.596 1.703 1.703 0 00-.258.948v3.96H5.998V6.322h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.55 2.55 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.09l-.774 1.849a.766.766 0 00-.244-.073z"></path>
                              </svg>
                            )}
                          </div>
                          <div className="community-search-text">
                            <div className="community-search-title">
                              {option.label}
                            </div>
                            {(option.members || option.subscribed) && (
                              <div className="community-search-subtitle">
                                {option.members}
                                {option.subscribed
                                  ? ` · ${option.subscribed}`
                                  : ""}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="create-post-tabs">
              {postTypes.map((type) => (
                <button
                  key={type.id}
                  className={`post-type-tab ${
                    selectedPostType === type.id ? "active" : ""
                  } ${
                    type.id === "poll" && !isCommunitySelected ? "disabled" : ""
                  }`}
                  disabled={type.id === "poll" && !isCommunitySelected}
                  onClick={() => {
                    if (type.id === "poll" && !isCommunitySelected) return;
                    handlePostTypeChange(type.id);
                  }}
                >
                  <span className="post-type-tab-text">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="create-post-form">
              {selectedPostType !== "poll" && (
                <>
                  <div className="post-tags-container">
                    {selectedTags.nsfw && (
                      <div className="NSFW tag-container">
                        <svg
                          rpl=""
                          className="NSFW-tag-icon"
                          fill="currentColor"
                          height="16"
                          icon-name="nsfw-fill"
                          style={{ verticalAlign: "text-bottom" }}
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {" "}
                          <path d="M12.823 10.928a.72.72 0 010 .799.844.844 0 01-.337.282c-.146.07-.304.105-.482.105a1.13 1.13 0 01-.479-.101.836.836 0 01-.343-.278.68.68 0 01-.125-.402.7.7 0 01.123-.405.852.852 0 01.335-.293c.144-.072.31-.11.49-.11.182 0 .346.038.486.11a.83.83 0 01.332.293zm-1.225-1.686c.12.066.257.1.406.1a.823.823 0 00.405-.1.733.733 0 00.385-.655.699.699 0 00-.103-.376.675.675 0 00-.283-.256.889.889 0 00-.403-.092.888.888 0 00-.404.092.698.698 0 00-.39.632.734.734 0 00.389.654h-.002zm6.437 3.09l-5.703 5.703A3.291 3.291 0 0110 19c-.844 0-1.69-.322-2.333-.965l-5.704-5.702a3.304 3.304 0 010-4.666l5.703-5.702a3.303 3.303 0 014.666 0l5.703 5.702a3.304 3.304 0 010 4.666zm-9.941-5.62L5.832 7.739l-.03.013v1.44l1.23-.545v4.64H8.57V6.71h-.475zm6.33 4.697c0-.333-.088-.642-.263-.917a1.996 1.996 0 00-.665-.638 1.86 1.86 0 00.615-1.382c0-.363-.097-.687-.286-.963a1.884 1.884 0 00-.766-.643 2.45 2.45 0 00-1.05-.227c-.377 0-.732.075-1.053.224a1.906 1.906 0 00-.774.64 1.65 1.65 0 00-.292.966c0 .279.059.545.175.79.107.227.255.426.44.595a1.974 1.974 0 00-.665.64 1.708 1.708 0 00.048 1.907c.209.296.502.533.87.704.367.17.784.257 1.24.257.45 0 .866-.085 1.232-.252a2.15 2.15 0 00.872-.7c.211-.298.319-.634.319-1l.003-.001z"></path>
                        </svg>
                        <span className="NSFW-tag-text">NSFW</span>
                      </div>
                    )}
                    {selectedTags.spoiler && (
                      <div className="Spoiler tag-container">
                        <svg
                          rpl=""
                          className="Spoiler-tag-icon"
                          fill="currentColor"
                          height="16"
                          icon-name="spoiler-fill"
                          style={{ verticalAlign: "text-bottom" }}
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {" "}
                          <path d="M18.035 7.667l-5.703-5.702a3.303 3.303 0 00-4.666 0L1.963 7.667a3.304 3.304 0 000 4.666l5.702 5.702A3.293 3.293 0 009.998 19c.844 0 1.69-.322 2.334-.965l5.701-5.702a3.304 3.304 0 00.002-4.666zm-6.982-2.456l-.25 6.058h-1.58l-.25-6.058h2.08zm-.007 8.988a1.157 1.157 0 01-.44.433 1.229 1.229 0 01-.614.157 1.196 1.196 0 01-1.041-.59 1.195 1.195 0 01-.161-.61 1.213 1.213 0 01.598-1.051c.184-.11.385-.165.604-.165a1.206 1.206 0 011.216 1.215c0 .223-.055.427-.162.611z"></path>
                        </svg>
                        <span className="Spoiler-tag-text">SPOILER</span>
                      </div>
                    )}
                    {selectedTags.brand && (
                      <div className="Brand tag-container">Brand Affiliate</div>
                    )}
                    {(selectedTags.nsfw ||
                      selectedTags.spoiler ||
                      selectedTags.brand) && (
                      <div className="edit-post-tags">
                        <CustomButton
                          className="small"
                          onClick={handleOpenTagsModal}
                        >
                          <svg
                            rpl=""
                            className="edit-tags-icon"
                            fill="currentColor"
                            height="16"
                            icon-name="edit"
                            viewBox="0 0 20 20"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {" "}
                            <path d="M14.016 3.8c.583 0 1.132.227 1.545.64.413.413.64.961.64 1.545a2.17 2.17 0 01-.64 1.545l-8.67 8.67-3.079-.01-.01-3.079 8.669-8.671c.413-.413.962-.64 1.545-.64zm0-1.8a3.97 3.97 0 00-2.817 1.167l-8.948 8.947a.858.858 0 00-.251.609l.014 4.408a.858.858 0 00.855.855L7.277 18h.003c.227 0 .446-.09.606-.251l8.947-8.947A3.985 3.985 0 0014.016 2z"></path>{" "}
                          </svg>
                        </CustomButton>
                      </div>
                    )}
                  </div>
                  <TextField
                    id="postTitleInput"
                    label="Title"
                    value={postTitle}
                    required={true}
                    onChange={(newValue) => {
                      setPostTitle(newValue);
                      setHasTyped(true);
                    }}
                    onFocus={() => setIsTitleFocused(true)}
                    onBlur={() => {
                      setIsTitleFocused(false);
                      if (hasTyped) {
                        setIsTitleTouched(true);
                      }
                    }}
                    maxLength={300}
                    containerClassName={`transparent-bg ${
                      isTitleTouched &&
                      !isTitleFocused &&
                      postTitle.length === 0
                        ? "invalid"
                        : ""
                    } ${isTitleFocused ? "focused" : ""}`.trim()}
                    labelClassName={
                      isTitleFocused || postTitle ? "floating" : ""
                    }
                    showErrorIcon={
                      isTitleTouched &&
                      !isTitleFocused &&
                      postTitle.length === 0
                    }
                    showValidIcon={
                      isTitleTouched && !isTitleFocused && postTitle.length > 0
                    }
                    errorMessage={
                      isTitleTouched &&
                      !isTitleFocused &&
                      postTitle.length === 0
                        ? "Please fill out this field."
                        : undefined
                    }
                    errorClassName={`white-error ${
                      isTitleTouched &&
                      !isTitleFocused &&
                      postTitle.length === 0
                        ? "invalid"
                        : ""
                    }`.trim()}
                    counterText={`${postTitle.length}/300`}
                    counterClassName={`white-counter ${
                      isTitleTouched &&
                      !isTitleFocused &&
                      postTitle.length === 0
                        ? "invalid"
                        : ""
                    }`.trim()}
                  />
                  <CustomButton
                    className="small"
                    disabled={!isCommunitySelected}
                    onClick={() => {
                      if (!isCommunitySelected) return;
                      handleOpenTagsModal();
                    }}
                  >
                    Add tags
                  </CustomButton>
                </>
              )}
              {selectedPostType === "text" && (
                <TextArea
                  value={postBody}
                  activeToolbarButtons={activeToolbarButtons}
                  onToolbarButtonClick={handleToolbarButtonClick}
                  onChange={(newValue) => setPostBody(newValue)}
                  placeholder="Body text (optional)"
                />
              )}

              {selectedPostType === "images" && (
                <div className="post-images-container">
                  <div className="post-images-placeholder">
                    <p className="post-image-prompt-text">
                      Drag and Drop or upload media
                    </p>
                    <label htmlFor="media-upload" style={{ cursor: "pointer" }}>
                      <input
                        type="file"
                        id="media-upload"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleMediaUpload}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="upload-media-button"
                        onClick={() =>
                          document.getElementById("media-upload").click()
                        }
                      >
                        <svg
                          rpl=""
                          fill="currentColor"
                          height="16"
                          icon-name="upload"
                          viewBox="0 0 20 20"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.3 16H6c-2.757 0-5-2.243-5-5a5.006 5.006 0 014.827-4.997c1.226-2.516 3.634-4.067 6.348-4.001a6.991 6.991 0 016.823 6.823 6.65 6.65 0 01-.125 1.434l-1.714-1.714c-.229-2.617-2.366-4.678-5.028-4.744-2.161-.059-4.058 1.307-4.892 3.463l-.247.638S6.448 7.798 6 7.798a3.204 3.204 0 00-3.2 3.2c0 1.764 1.436 3.2 3.2 3.2h4.3V16zm6.616-5.152l-3.28-3.28a.901.901 0 00-1.273 0l-3.28 3.28a.898.898 0 000 1.272.898.898 0 001.272 0l1.744-1.743v7.117a.9.9 0 001.8 0v-7.117l1.744 1.743a.898.898 0 001.272 0 .898.898 0 00.001-1.272z"></path>
                        </svg>
                      </button>
                    </label>
                  </div>
                </div>
              )}

              {selectedPostType === "link" && (
                <>
                  <TextField
                    id="postLinkInput"
                    label="Link URL"
                    value={postLink}
                    required={true}
                    onChange={(newValue) => {
                      setPostLink(newValue);
                      setHasTypedLink(true);
                      // Validate link format
                      if (newValue.length > 0) {
                        const linkPattern = /^(https?:\/\/).+/;
                        setIsLinkInvalidFormat(!linkPattern.test(newValue));
                      } else {
                        setIsLinkInvalidFormat(false);
                      }
                    }}
                    onFocus={() => setIsLinkFocused(true)}
                    onBlur={() => {
                      setIsLinkFocused(false);
                      if (hasTypedLink) {
                        setIsLinkTouched(true);
                        // Validate link format on blur
                        if (postLink.length > 0) {
                          const linkPattern = /^(https?:\/\/).+/;
                          setIsLinkInvalidFormat(!linkPattern.test(postLink));
                        }
                      }
                    }}
                    maxLength={300}
                    containerClassName={`transparent-bg ${
                      (isLinkTouched &&
                        !isLinkFocused &&
                        postLink.length === 0) ||
                      (isLinkTouched && !isLinkFocused && isLinkInvalidFormat)
                        ? "invalid"
                        : ""
                    } ${isLinkFocused ? "focused" : ""}`.trim()}
                    labelClassName={`${
                      isLinkFocused || postLink ? "floating" : ""
                    }`}
                    showErrorIcon={
                      isLinkTouched &&
                      !isLinkFocused &&
                      (postLink.length === 0 || isLinkInvalidFormat)
                    }
                    errorMessage={
                      isLinkTouched && !isLinkFocused && postLink.length === 0
                        ? "Please fill out this field."
                        : isLinkTouched &&
                          !isLinkFocused &&
                          isLinkInvalidFormat &&
                          postLink.length > 0
                        ? "Link doesn't look right"
                        : undefined
                    }
                    errorClassName={`white-error ${
                      isLinkTouched && !isLinkFocused && postLink.length === 0
                        ? "invalid"
                        : isLinkTouched &&
                          !isLinkFocused &&
                          isLinkInvalidFormat &&
                          postLink.length > 0
                        ? "invalid"
                        : ""
                    }`.trim()}
                    counterText={`${postLink.length}/300`}
                    counterClassName={`white-counter ${
                      isLinkTouched && !isLinkFocused && postLink.length === 0
                        ? "invalid"
                        : isLinkTouched &&
                          !isLinkFocused &&
                          isLinkInvalidFormat &&
                          postLink.length > 0
                        ? "invalid"
                        : ""
                    }`.trim()}
                  />
                </>
              )}
              {selectedPostType === "poll" && (
                <div className="post-poll-container">
                  <p className="post-poll-placeholder">
                    <svg
                      rpl=""
                      fill="currentColor"
                      className="post-poll-icon"
                      height="16"
                      icon-name="info"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm-.57 6.16c-.17-.1-.31-.24-.41-.41-.1-.17-.15-.36-.15-.57 0-.21.05-.4.15-.57.1-.17.24-.31.41-.41.17-.1.36-.15.57-.15.21 0 .4.05.57.15.17.1.31.24.41.41.1.17.15.36.15.57 0 .21-.05.4-.15.57-.1.17-.24.31-.41.41-.17.1-.36.15-.57.15-.21 0-.4-.05-.57-.15zm1.5 7.68H9.07v-6.3h1.86v6.3z"></path>
                    </svg>
                    <strong>Creating a poll?</strong> Polls on the web are under
                    construction, but you can still create one in the Reddit
                    app.{" "}
                    <span style={{ color: "#648efc" }}>Download the app</span>{" "}
                    to get started.
                  </p>
                </div>
              )}
              {selectedPostType !== "poll" && (
                <>
                  <div className="create-post-footer">
                    <CustomButton
                      className="blue-button"
                      disabled={!isFormValid()}
                    >
                      Save Draft
                    </CustomButton>
                    {selectedCommunity && (
                      <CustomButton
                        className="blue-button"
                        onClick={() => {}}
                        disabled={!isFormValid()}
                      >
                        <svg
                          rpl=""
                          fill="currentColor"
                          height="20"
                          icon-name="clock"
                          viewBox="0 0 20 20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {" "}
                          <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm.9 8.63V4.68H9.1V10c0 .24.1.47.26.64l3.76 3.76 1.27-1.27-3.49-3.5z"></path>
                        </svg>
                      </CustomButton>
                    )}
                    <CustomButton
                      className="blue-button"
                      disabled={!isFormValid()}
                    >
                      Post
                    </CustomButton>
                  </div>
                </>
              )}
            </div>

            <div className="create-post-footer-links">
              <p className="post-footer hyperlink">Reddit Rules</p>
              <p className="post-footer hyperlink">Privacy Policy</p>
              <p className="post-footer hyperlink">User Agreement</p>
              <p className="post-footer hyperlink">Accessibility</p>
              <p className="post-footer"> · </p>
              <p className="post-footer hyperlink">
                Reddit, Inc. © 2025. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showTagsModal && (
        <div
          className="tags-modal-overlay"
          onClick={() => setShowTagsModal(false)}
        >
          <div className="tags-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tags-modal-header">
              <h2 className="tags-modal-title">Add tags</h2>
              <CloseButton onClick={handleCancelTags} />
            </div>
            <div className="tags-modal-body">
              <div className="tag-row">
                <div className="tag-icon">
                  <svg
                    rpl=""
                    fill="currentColor"
                    height="20"
                    icon-name="nsfw"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path d="M10 19a3.29 3.29 0 01-2.333-.965l-5.702-5.702a3.304 3.304 0 010-4.666l5.701-5.702a3.303 3.303 0 014.668 0l5.701 5.702a3.304 3.304 0 010 4.666l-5.701 5.702A3.292 3.292 0 019.998 19H10zm0-16.2c-.383 0-.768.145-1.06.437L3.24 8.94a1.502 1.502 0 000 2.122l5.702 5.702a1.501 1.501 0 002.12 0l5.703-5.702a1.502 1.502 0 000-2.122l-5.702-5.702a1.496 1.496 0 00-1.06-.438H10zM5.834 7.74l-.029.013v1.44l1.23-.545v4.64H8.57V6.711h-.476L5.833 7.74v.001zm8.33 2.751a1.994 1.994 0 00-.665-.638 1.846 1.846 0 00.615-1.381c0-.364-.096-.688-.285-.964a1.884 1.884 0 00-.768-.643 2.45 2.45 0 00-1.05-.227c-.377 0-.73.075-1.051.224a1.906 1.906 0 00-.775.641 1.65 1.65 0 00-.292.965c0 .28.059.545.176.791.107.226.255.425.439.594a1.973 1.973 0 00-.665.641A1.708 1.708 0 009.89 12.4c.21.296.503.533.87.704.367.171.784.257 1.242.257.45 0 .865-.085 1.23-.252a2.15 2.15 0 00.873-.7c.212-.298.319-.634.319-1 0-.333-.088-.642-.264-.917h.003zm-1.338 1.236a.844.844 0 01-.336.282c-.147.07-.305.105-.482.105-.175 0-.335-.034-.48-.1a.836.836 0 01-.342-.279.68.68 0 01-.126-.402.7.7 0 01.123-.405.851.851 0 01.335-.293c.145-.072.31-.109.49-.109.183 0 .347.037.486.11a.83.83 0 01.332.292.72.72 0 010 .8zm-.131-2.757a.733.733 0 01-.284.272.823.823 0 01-.403.1.834.834 0 01-.406-.1.743.743 0 01-.284-1.029.698.698 0 01.285-.257.888.888 0 01.403-.092c.147 0 .284.031.404.092.121.06.214.144.284.256a.708.708 0 01.103.376.743.743 0 01-.103.383z"></path>
                  </svg>
                </div>
                <div className="tag-text">
                  <div className="tag-title">Not Safe For Work (NSFW)</div>
                  <div className="tag-subtitle">
                    Contains mature or adult content
                  </div>
                </div>
                <ToggleButton
                  checked={tempTags.nsfw}
                  onClick={() => handleToggleTag("nsfw")}
                />
              </div>
              <div className="tag-row">
                <div className="tag-icon">
                  <svg
                    rpl=""
                    fill="currentColor"
                    height="20"
                    icon-name="caution"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path d="M9.39 14.632a1.185 1.185 0 01-.598-1.044 1.213 1.213 0 01.598-1.051c.183-.109.384-.164.603-.164.224 0 .428.055.615.164a1.198 1.198 0 01.601 1.051c0 .223-.053.427-.16.611a1.157 1.157 0 01-.44.433 1.229 1.229 0 01-.616.157c-.219 0-.42-.052-.604-.157zm-.165-3.364l-.25-6.058h2.082l-.252 6.058h-1.58zM10.002 19c-.845 0-1.69-.322-2.334-.965l-5.702-5.702a3.304 3.304 0 010-4.666l5.701-5.702a3.303 3.303 0 014.668 0l5.701 5.702a3.304 3.304 0 010 4.666l-5.701 5.702A3.292 3.292 0 019.998 19H10zm0-16.2c-.384 0-.768.145-1.06.437L3.237 8.94a1.502 1.502 0 000 2.122l5.703 5.702a1.501 1.501 0 002.12 0l5.703-5.702a1.502 1.502 0 000-2.122l-5.702-5.702a1.496 1.496 0 00-1.06-.438H10z"></path>
                  </svg>
                </div>
                <div className="tag-text">
                  <div className="tag-title">Spoiler</div>
                  <div className="tag-subtitle">May ruin a surprise</div>
                </div>
                <ToggleButton
                  checked={tempTags.spoiler}
                  onClick={() => handleToggleTag("spoiler")}
                />
              </div>
              <div className="tag-row">
                <div className="tag-icon">
                  <svg
                    rpl=""
                    fill="currentColor"
                    height="20"
                    icon-name="brand-awareness"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path d="M15.156 2.327a1.592 1.592 0 00-1.634.071c-.26.171-.531.361-.814.559C11.339 3.915 9.787 5 8 5H5C2.795 5 1 6.794 1 9c0 1.514.856 2.819 2.1 3.498V16c0 1.599 1.302 2.9 2.9 2.9 1.598 0 2.9-1.301 2.9-2.9v-2.9c1.413.28 2.674 1.151 3.808 1.943.283.198.555.388.814.559a1.585 1.585 0 001.634.072A1.6 1.6 0 0016 14.262V3.738c0-.59-.323-1.13-.844-1.411zM5 6.8h2.1v4.4H5A2.202 2.202 0 012.801 9c0-1.213.986-2.2 2.199-2.2zm1 10.3c-.606 0-1.1-.494-1.1-1.1v-3.01c.034 0 .065.01.1.01h2.1v3c0 .606-.493 1.1-1.1 1.1zm8.199-3.212c-.149-.103-.303-.21-.459-.32-1.312-.917-2.901-2.029-4.84-2.304V6.736c1.938-.275 3.528-1.387 4.84-2.304.156-.11.31-.217.459-.32v9.776zm3.2-10.024l1.243-.333a.898.898 0 11.466 1.738l-1.709.458V3.864zM18.875 9.9h-1.477V8.1h1.477a.9.9 0 010 1.8zm.869 3.933a.9.9 0 01-1.102.636l-1.243-.333v-1.863l1.709.458a.9.9 0 01.636 1.102z"></path>{" "}
                  </svg>
                </div>
                <div className="tag-text">
                  <div className="tag-title">Brand affiliate</div>
                  <div className="tag-subtitle">
                    Made for a brand or business
                  </div>
                </div>
                <ToggleButton
                  checked={tempTags.brand}
                  onClick={() => handleToggleTag("brand")}
                />
              </div>
            </div>
            <div className="tags-modal-footer">
              <CustomButton onClick={handleCancelTags}>Cancel</CustomButton>
              <CustomButton className="blue-button" onClick={handleAddTags}>
                Add
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
