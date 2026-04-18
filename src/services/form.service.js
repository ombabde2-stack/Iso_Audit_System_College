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

export const getMyFormsService = async (user, query) => {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    submittedBy: user._id
  };

  const totalCount = await Form.countDocuments(filter);

  const forms = await Form.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    forms,
    pagination: {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit
    }
  };
};

export const getSingleFormService = async (formId, user) => {

  const form = await Form.findById(formId)
    .populate("submittedBy", "name email role");

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  // Faculty can only see own forms
  if (
    user.role === "faculty" &&
    form.submittedBy._id.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "Access denied");
  }

  // HOD only same department
  if (
    user.role === "hod" &&
    form.department !== user.department
  ) {
    throw new ApiError(403, "Access denied");
  }

  return form;
};
