import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    // 🔹 Type of ISO form
    formType: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    // 🔹 Who submitted
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // 🔹 Department
    department: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    // 🔹 Workflow status
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },

    // 🔹 Dynamic form data
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }

  },
  {
    timestamps: true
  }
);


// INDEXES (important for scalability)
formSchema.index({ formType: 1, department: 1 });
formSchema.index({ status: 1, createdAt: -1 });
formSchema.index({ submittedBy: 1, createdAt: -1 });


export const Form = mongoose.model("Form", formSchema);