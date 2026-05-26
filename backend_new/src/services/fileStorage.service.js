import fs from "fs/promises";
import { getCloudinaryClient } from "../config/cloudinary.js";

export const storeFormSubmissionFile = async (file, formType) => {
  if (!file) return null;

  try {
    const cloudinary = getCloudinaryClient();

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: `iso-audit/forms/${formType}`,
      use_filename: true,
      unique_filename: true,
    });

    return {
      filename: file.originalname,
      url: uploadResult.secure_url,
      storage: "cloudinary",
      publicId: uploadResult.public_id,
    };
  } finally {
    if (file.path) {
      await fs.unlink(file.path).catch(() => {});
    }
  }
};
