import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/ApiError.js";

const getCloudinaryEnv = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY;

  return { cloudName, apiKey, apiSecret };
};

export const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  return Boolean(cloudName && apiKey && apiSecret);
};

export const assertCloudinaryConfigured = () => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, "Cloudinary is not configured on the server.");
  }
};

export const getCloudinaryClient = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  assertCloudinaryConfigured();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
};

export default cloudinary;
