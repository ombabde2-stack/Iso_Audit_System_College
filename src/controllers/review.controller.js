import { asyncHandler } from "../utils/asyncHandler.js";
import { updateFormStatusService } from "../services/review.service.js";

export const updateFormStatus = asyncHandler(async (req, res) => {

  const { status, remarks } = req.body;

  const form = await updateFormStatusService(
    req.params.id,
    req.user,
    status,
    remarks
  );

  res.status(200).json({
    success: true,
    message: `Form ${status.toLowerCase()}`,
    data: form
  });
});