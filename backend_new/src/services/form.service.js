import path from "path";
import { Form } from "../models/form.model.js";
import { FormTemplate } from "../models/formTemplate.model.js";
import { ApiError } from "../utils/ApiError.js";
import { storeFormSubmissionFile } from "./fileStorage.service.js";

export const createFormService = async (user, payload, file) => {
  const { formType, remarks = "", status = "PENDING" } = payload;

  if (!formType) throw new ApiError(400, "formType is required.");
  if (!file) throw new ApiError(400, "Please upload the completed form file.");

  const template = await FormTemplate.findOne({ formNo: formType, status: "ACTIVE" });
  if (!template) throw new ApiError(404, `Form template '${formType}' not found or inactive.`);

  if (!template.assignedRoles.includes(user.role)) {
    throw new ApiError(403, "You are not authorized to submit this form.");
  }

  if (template.deadline && new Date() > template.deadline) {
    throw new ApiError(400, "Submission deadline has passed.");
  }

  const templateExtension = path.extname(template.sourceFile || "").toLowerCase();
  const uploadedExtension = path.extname(file.originalname || "").toLowerCase();
  if (templateExtension && uploadedExtension && templateExtension !== uploadedExtension) {
    throw new ApiError(400, `Please upload the completed form in '${templateExtension}' format.`);
  }

  const storedFile = await storeFormSubmissionFile(file, formType);

  const form = await Form.create({
    formType,
    formTitle: template.title,
    submittedBy: user._id,
    department: user.department,
    submitterRemarks: remarks,
    status: status === "DRAFT" ? "DRAFT" : "PENDING",
    attachments: storedFile ? [storedFile] : [],
  });

  return form;
};

export const getAllFormsService = async (user, query) => {
  const { status, formType, page = 1, limit = 15, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};

  if (user.role === "hod") {
    filter.department = user.department;
  }

  if (status) filter.status = status.toUpperCase();
  if (formType) filter.formType = formType;
  if (search) {
    filter.$or = [
      { formType: { $regex: search, $options: "i" } },
      { formTitle: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }

  const [forms, total] = await Promise.all([
    Form.find(filter)
      .populate("submittedBy", "name email role department signatureUrl")
      .populate("reviewedBy", "name email signatureUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Form.countDocuments(filter),
  ]);

  return {
    forms,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  };
};

export const getMyFormsService = async (user, query) => {
  const { status, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = { submittedBy: user._id };
  if (status) filter.status = status.toUpperCase();

  const [forms, total] = await Promise.all([
    Form.find(filter)
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Form.countDocuments(filter),
  ]);

  return {
    forms,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  };
};

export const getSingleFormService = async (formId, user) => {
  const form = await Form.findById(formId)
    .populate("submittedBy", "name email role department signatureUrl")
    .populate("reviewedBy", "name email signatureUrl");

  if (!form) throw new ApiError(404, "Form not found.");

  if (!["hod", "admin"].includes(user.role) && form.submittedBy._id.toString() !== user._id.toString()) {
    throw new ApiError(403, "Access denied.");
  }

  if (user.role === "hod" && form.department !== user.department) {
    throw new ApiError(403, "Access denied for this department.");
  }

  return form;
};

export const updateFormSubmissionService = async (user, formId, payload, file) => {
  const { remarks } = payload;

  const form = await Form.findById(formId);
  if (!form) throw new ApiError(404, "Form not found.");

  // Check ownership
  if (form.submittedBy.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only update your own submissions.");
  }

  // Only DRAFT or RETURNED forms can be edited
  if (!["DRAFT", "RETURNED"].includes(form.status)) {
    throw new ApiError(400, `Cannot edit a form with status '${form.status}'.`);
  }

  // Handle new file if uploaded
  if (file) {
    const storedFile = await storeFormSubmissionFile(file, form.formType);
    if (storedFile) {
      form.attachments = [storedFile];
    }
  }

  if (remarks) form.submitterRemarks = remarks;
  form.status = "PENDING"; // Move back to pending queue
  await form.save();

  return form;
};
