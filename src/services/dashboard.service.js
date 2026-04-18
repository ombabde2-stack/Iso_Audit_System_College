// services/dashboard.service.js

import { Form } from "../models/form.model.js";

export const getFacultyDashboardService = async (user) => {

  const stats = await Form.aggregate([
    {
      $match: {
        submittedBy: user._id
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  // Convert to structured response
  const result = {
    totalSubmitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  stats.forEach(item => {
    result.totalSubmitted += item.count;

    if (item._id === "PENDING") result.pending = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
  });

  return result;
};

export const getHodDashboardService = async (user) => {

  const stats = await Form.aggregate([
    {
      $match: {
        department: user.department
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    totalForms: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0
  };

  stats.forEach(item => {
    result.totalForms += item.count;

    if (item._id === "PENDING") result.pendingApproval = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
  });

  // 🔥 Recent submissions (extra)
  const recentForms = await Form.find({
    department: user.department
  })
    .populate("submittedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    ...result,
    recentForms
  };
};