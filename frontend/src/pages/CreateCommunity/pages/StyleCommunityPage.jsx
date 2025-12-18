import { useState } from 'react';
import './StyleCommunityPage.css';
import '../CreateCommunity.css';
import CustomButton from '../../../components/CustomButton';
import ImageCropModal from '../ImageCropModal';

const StyleCommunityPage = ({
  bannerImage,
  bannerImageUrl,
  iconImage,
  iconImageUrl,
  communityName,
  communityDescription,
  onBannerImageSave,
  onIconImageSave,
  onBannerImageDelete,
  onIconImageDelete,
}) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageType, setCropImageType] = useState(null); // 'banner' or 'icon'
  const [cropImagePreview, setCropImagePreview] = useState(null);

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
      onBannerImageSave(croppedFile, croppedUrl);
    } else {
      onIconImageSave(croppedFile, croppedUrl);
    }

    handleCropModalClose();
  };

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
                  onClick={onBannerImageDelete}
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
                  onClick={onIconImageDelete}
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

export default StyleCommunityPage;