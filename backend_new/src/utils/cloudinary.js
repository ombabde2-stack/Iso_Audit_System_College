import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { getCloudinaryClient } from "../config/cloudinary.js";

/**
 * Uploads a file to Cloudinary and deletes the local file
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object|null>} - Cloudinary upload result
 */
const uploadOnCloudinary = async (localFilePath, folder = "iso-audit") => {
  try {
    if (!localFilePath) return null;

    // Ensure cloudinary is configured
    getCloudinaryClient();

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });

    // File has been uploaded successfully
    fs.unlinkSync(localFilePath);
    return response;
  }
  catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
