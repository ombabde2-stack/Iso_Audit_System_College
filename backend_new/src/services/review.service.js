import { Form } from "../models/form.model.js";
import { AuditLog } from "../models/auditLog.model.js";
import { ApiError } from "../utils/ApiError.js";

export const updateFormStatusService = async (formId, user, status, remarks, ip) => {
  const form = await Form.findById(formId).populate("submittedBy", "name email");
  if (!form) throw new ApiError(404, "Form not found.");

  // HOD department check
  if (user.role === "hod" && form.department !== user.department) {
    throw new ApiError(403, "Access denied for this department.");
  }

  // Only PENDING forms can be reviewed
  if (form.status !== "PENDING") {
    throw new ApiError(400, `Cannot review a form with status '${form.status}'.`);
  }

  const allowedStatuses = ["APPROVED", "REJECTED", "RETURNED"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Status must be APPROVED, REJECTED, or RETURNED.");
  }

  if ((status === "REJECTED" || status === "RETURNED") && !remarks) {
    throw new ApiError(400, "Remarks are required when rejecting or returning a form.");
  }

  form.status = status;
  form.reviewedBy = user._id;
  form.reviewedAt = new Date();
  form.remarks = remarks || "";
  await form.save();

  // Audit log
  await AuditLog.create({
    user: user._id, userName: user.name,
    action: `FORM_${status}`,
    resource: "Form", resourceId: formId,
    details: { formType: form.formType, remarks },
    ip,
  });

  return form;
};

// HOD pending queue
export const getHODQueueService = async (user, query) => {
  const { page = 1, limit = 15, formType, status = "PENDING" } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {
    department: user.department,
  };

  if (status === "HISTORY") {
    filter.status = { $in: ["APPROVED", "REJECTED", "RETURNED"] };
    filter.reviewedBy = user._id; // Show only forms this specific HOD approved/rejected
  } else {
    filter.status = status;
  }
  
  if (formType) filter.formType = formType;

  const [forms, total] = await Promise.all([
    Form.find(filter)
      .populate("submittedBy", "name email role designation")
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
