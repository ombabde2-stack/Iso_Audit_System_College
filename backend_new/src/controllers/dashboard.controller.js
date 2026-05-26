import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getUserDashboardService, getHodDashboardService, getAdminDashboardService, getHodResearchAnalyticsService } from "../services/dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  let data;
  if (req.user.role === "admin") {
    data = await getAdminDashboardService();
  } else if (req.user.role === "hod") {
    data = await getHodDashboardService(req.user);
  } else {
    data = await getUserDashboardService(req.user);
  }
  res.status(200).json(new ApiResponse(200, data, "Dashboard data fetched."));
});

export const getResearchAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== "hod") {
    return res.status(403).json(new ApiResponse(403, null, "Only HOD can access research analytics"));
  }
  const data = await getHodResearchAnalyticsService(req.user);
  res.status(200).json(new ApiResponse(200, data, "Research analytics fetched."));
});
