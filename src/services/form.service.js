import { Form } from "../models/form.model.js";
import { FormTemplate } from "../models/formTemplate.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createFormService = async (user, payload) => {
  const { formType, data } = payload;

  // 1. Validate input
  if (!formType || !data) {
    throw new ApiError(400, "formType and data are required");
  }

  // 2. Check template exists
  const template = await FormTemplate.findOne({
    formNo: formType,
    status: "ACTIVE"
  });

  if (!template) {
    throw new ApiError(404, "Form template not found");
  }

  // 3. Role check
  if (template.assignedRole !== user.role) {
    throw new ApiError(403, "Not allowed to submit this form");
  }

  // 4. Deadline check
  if (template.deadline && new Date() > template.deadline) {
    throw new ApiError(400, "Deadline has passed");
  }

  // 5. Prevent duplicate submission
  const existing = await Form.findOne({
    formType,
    submittedBy: user._id
  });

  if (existing) {
    throw new ApiError(409, "Form already submitted");
  }

  // 6. Create form
  const form = await Form.create({
    formType,
    submittedBy: user._id,
    department: user.department,
    data,
    status: "PENDING"
  });

  return form;
};

export const getAllFormsService = async (user) => {

  let filter = {};

  // HOD → only department
  if (user.role === "hod") {
    filter.department = user.department;
  }

  // Admin → no restriction

  const forms = await Form.find(filter)
    .populate("submittedBy", "name email role")
    .sort({ createdAt: -1 });

  return forms;
};

