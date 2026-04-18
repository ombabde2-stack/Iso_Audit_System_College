import { asyncHandler } from "../utils/asyncHandler.js";
import {getFacultyDashboardService, getHodDashboardService} from "../services/dashboard.service.js";
import { ApiError } from "../utils/ApiError.js";

export const getDashboard = asyncHandler(async (req, res) => {

  const user = req.user;

  let data;

  if (user.role === "faculty") {
    data = await getFacultyDashboardService(user);
  } 
  else if (user.role === "hod") {
    data = await getHodDashboardService(user);
  } 
  else {
    throw new ApiError(403, "Dashboard not available for this role");
  }

  res.status(200).json({
    success: true,
    message: "Dashboard fetched",
    data
  });
});