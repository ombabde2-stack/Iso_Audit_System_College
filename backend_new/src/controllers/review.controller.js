import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { updateFormStatusService, getHODQueueService } from "../services/review.service.js";

export const updateFormStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  const ip = req.ip || req.headers["x-forwarded-for"];
  const form = await updateFormStatusService(req.params.id, req.user, status, remarks, ip);
  res.status(200).json(new ApiResponse(200, form, `Form ${status.toLowerCase()} successfully.`));
});

export const getHODQueue = asyncHandler(async (req, res) => {
  const result = await getHODQueueService(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result, "HOD queue fetched."));
});
