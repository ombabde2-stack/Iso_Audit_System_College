import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    formType: {
      type: String, // e.g., "105", "119", "655-A"
      required: true,
      index: true,
    },
    formTitle: {
      type: String,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "APPROVED", "REJECTED", "RETURNED"],
      default: "PENDING",
      index: true,
    },
    // Dynamic data - flexible mixed type
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // HOD Review
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    remarks: {
      type: String,
    },
    submitterRemarks: {
      type: String,
    },
    // File attachments
    attachments: [
      {
        filename: String,
        url: String,
        storage: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance
formSchema.index({ formType: 1, department: 1 });
formSchema.index({ submittedBy: 1, createdAt: -1 });
formSchema.index({ status: 1, createdAt: -1 });
formSchema.index({ department: 1, status: 1 });

export const Form = mongoose.model("Form", formSchema);
