import { Form } from "../models/form.model.js";
import { ApiError } from "../utils/ApiError.js";

export const updateFormStatusService = async (
  formId,
  user,
  status,
  remarks
) => {

  const form = await Form.findById(formId);

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  //  Department restriction
  if (form.department !== user.department) {
    throw new ApiError(403, "Access denied for this department");
  }

  // STRICT WORKFLOW VALIDATION
  if (form.status !== "PENDING") {
    throw new ApiError(
      400,
      `Invalid transition: ${form.status} → ${status}`
    );
  }

  // 🔥 Allowed statuses only
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  // 🔥 Remarks required for rejection
  if (status === "REJECTED" && !remarks) {
    throw new ApiError(400, "Remarks required for rejection");
  }

  // ✅ Update
  form.status = status;
  form.reviewedBy = user._id;
  form.reviewedAt = new Date();
  form.remarks = remarks || "";

  await form.save();

  return form;
};