const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const DEFAULT_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "reddit";

/**
 * Upload media to Cloudinary and return the NEW public URL (secure_url).
 * Supports nested folders, e.g. folderPath = "items/reddit".
 *
 * @param {string} image - local file path or remote URL or base64 data URI
 * @param {string} [folderPath="reddit"] - Cloudinary folder path (can be nested like "Items/reddit")
 * @returns {Promise<string>} secure public URL of the uploaded asset
 */
const uploadImage = async (image, folderPath = DEFAULT_UPLOAD_FOLDER) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: folderPath,
    resource_type: "auto",
  });
  return result.secure_url;
};


cloudinary.uploadImage = uploadImage;

module.exports = cloudinary;