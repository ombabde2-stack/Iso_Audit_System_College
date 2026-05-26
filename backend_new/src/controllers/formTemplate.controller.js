import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getTemplatesForRoleService,
  getTemplateForRoleByFormNoService,
  getAllTemplatesService,
  createTemplateService,
  updateTemplateService,
} from "../services/formTemplate.service.js";

export const getMyTemplates = asyncHandler(async (req, res) => {
  const templates = await getTemplatesForRoleService(req.user.role);
  res.status(200).json(new ApiResponse(200, templates, "Templates fetched."));
});

export const getMyTemplateByFormNo = asyncHandler(async (req, res) => {
  const template = await getTemplateForRoleByFormNoService(req.user.role, req.params.formNo);
  res.status(200).json(new ApiResponse(200, template, "Template fetched."));
});

export const getAllTemplates = asyncHandler(async (req, res) => {
  const templates = await getAllTemplatesService(req.query);
  res.status(200).json(new ApiResponse(200, templates, "All templates fetched."));
});

export const createTemplate = asyncHandler(async (req, res) => {
  const template = await createTemplateService(req.body);
  res.status(201).json(new ApiResponse(201, template, "Template created."));
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await updateTemplateService(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, template, "Template updated."));
});
