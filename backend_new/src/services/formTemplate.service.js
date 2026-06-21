import { FormTemplate } from "../models/formTemplate.model.js";
import { ApiError } from "../utils/ApiError.js";

const sanitizeTemplatePayload = (data) => {
  const { fields, sections, ...templateData } = data;
  return templateData;
};

// Get templates assigned to a given role
export const getTemplatesForRoleService = async (role) => {
  const templates = await FormTemplate.find({
    assignedRoles: role,
    status: "ACTIVE",
  })
    .select("formNo title description sourceFile assignedRoles requiresHODApproval deadline")
    .sort({ formNo: 1 });
  return templates;
};

export const getTemplateForRoleByFormNoService = async (role, formNo) => {
  const template = await FormTemplate.findOne({
    formNo,
    assignedRoles: role,
    status: "ACTIVE",
  }).select("formNo title description sourceFile assignedRoles requiresHODApproval deadline");

  if (!template) {
    throw new ApiError(404, `Assigned template '${formNo}' not found.`);
  }

  return template.toObject();
};

// Get all templates (admin only)
export const getAllTemplatesService = async (query) => {
  const { status, role, search } = query;
  const filter = {};
  if (status) filter.status = status;
  if (role) filter.assignedRoles = role;
  if (search) {
    filter.$or = [
      { formNo: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
    ];
  }

  return FormTemplate.find(filter).sort({ formNo: 1 });
};

// Create template (admin only)
export const createTemplateService = async (data) => {
  const exists = await FormTemplate.findOne({ formNo: data.formNo });
  if (exists) throw new ApiError(409, `Template with formNo '${data.formNo}' already exists.`);
  return FormTemplate.create(sanitizeTemplatePayload(data));
};

// Update template (admin only)
export const updateTemplateService = async (id, data) => {
  const template = await FormTemplate.findByIdAndUpdate(
    id, 
    sanitizeTemplatePayload(data),
    { new: true, runValidators: true }
  );
  if (!template) throw new ApiError(404, "Template not found.");
  return template;
};
