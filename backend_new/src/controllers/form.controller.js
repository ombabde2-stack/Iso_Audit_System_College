import fs from "fs/promises";
import https from "https";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createFormService,
  getAllFormsService,
  getMyFormsService,
  getSingleFormService,
} from "../services/form.service.js";

export const createForm = asyncHandler(async (req, res) => {
  try {
    const form = await createFormService(req.user, req.body, req.file);
    res.status(201).json(new ApiResponse(201, form, "Form submitted successfully."));
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    throw error;
  }
});

export const getAllForms = asyncHandler(async (req, res) => {
  const result = await getAllFormsService(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result, "Forms fetched successfully."));
});

export const getMyForms = asyncHandler(async (req, res) => {
  const result = await getMyFormsService(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result, "My forms fetched."));
});

export const getSingleForm = asyncHandler(async (req, res) => {
  const form = await getSingleFormService(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, form, "Form details fetched."));
});

export const downloadFormFile = asyncHandler(async (req, res) => {
  const form = await getSingleFormService(req.params.id, req.user);
  
  if (!form.attachments || form.attachments.length === 0) {
    res.status(404).json(new ApiResponse(404, null, "No file attached to this form."));
    return;
  }
  
  const fileUrl = form.attachments[0].url;
  const fileName = form.attachments[0].filename;

  https.get(fileUrl, (response) => {
    // Check if redirect (Cloudinary sometimes redirects)
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      https.get(response.headers.location, (redirectResponse) => {
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', redirectResponse.headers['content-type'] || 'application/octet-stream');
        redirectResponse.pipe(res);
      });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    response.pipe(res);
  }).on('error', (err) => {
    res.status(500).json(new ApiResponse(500, null, "Failed to download file from storage."));
  });
});
