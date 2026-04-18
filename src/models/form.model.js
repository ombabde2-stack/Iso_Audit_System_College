import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    // Reference to template (IMPORTANT)
    formType: {
      type: String, // FF-114, FF-117
      required: true,
      index: true
    },

    // Who submitted
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Department
    department: {
      type: String,
      required: true,
      index: true
    },

    // Workflow status
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },

    // 🔥 Dynamic data (core feature)
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    // Review tracking (HOD)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: {
      type: Date
    },

    remarks: {
      type: String
    }

  },
  {
    timestamps: true
  }
);


// 🔥 INDEXES (important for dashboard + queries)
formSchema.index({ formType: 1, department: 1 });
formSchema.index({ submittedBy: 1, createdAt: -1 });
formSchema.index({ status: 1, createdAt: -1 });

export const Form = mongoose.model("Form", formSchema);