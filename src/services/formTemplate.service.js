import { FormTemplate } from "../models/formTemplate.model.js";

export const getAssignedFormsService = async (user) => {

  const templates = await FormTemplate.find({
    $or: [
      { assignedTo: user.role },        // role-based
      { assignedUsers: user._id }       // user-based
    ]
  }).select("-__v");

  return templates;
};