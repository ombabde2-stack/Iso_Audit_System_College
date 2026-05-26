import mongoose from "mongoose";
import { ALL_ROLES } from "./user.model.js";

const formTemplateSchema = new mongoose.Schema(
  {
    formNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    sourceFile: {
      type: String,
      trim: true,
    },
    // Multiple roles can be assigned
    assignedRoles: [
      {
        type: String,
        enum: ALL_ROLES,
      },
    ],
    // HOD approval required for this form?
    requiresHODApproval: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    deadline: {
      type: Date,
    },
    // Dynamic field schema definition
    fields: [
      {
        name: String,
        label: String,
        type: {
          type: String,
          enum: ["text", "number", "date", "month", "textarea", "select", "checkbox", "file"],
          default: "text",
        },
        required: Boolean,
        options: [String], // For select fields
        placeholder: String,
      },
    ],
    // New: Structured UI Blueprint
    sections: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

formTemplateSchema.index({ assignedRoles: 1, status: 1 });

export const FormTemplate = mongoose.model("FormTemplate", formTemplateSchema);
