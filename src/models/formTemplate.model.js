import mongoose from "mongoose";

const formTemplateSchema = new mongoose.Schema(
  {
    formNo: {
      type: String, // FF-114, FF-117
      required: true,
      unique: true,
      trim: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    assignedRole: {
      type: String,
      enum: ["faculty", "hod", "admin"],
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },

    deadline: {
      type: Date
    }

  },
  {
    timestamps: true
  }
);

export const FormTemplate = mongoose.model("FormTemplate", formTemplateSchema);