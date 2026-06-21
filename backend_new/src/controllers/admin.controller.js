import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getAllUsersService, updateUserRoleService, toggleUserStatusService,
  deleteUserService, adminResetPasswordService, getAuditLogsService, getAdminFormStatsService,
  approveUserService, createUserByAdminService,
} from "../services/admin.service.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await getAllUsersService(req.query);
  res.status(200).json(new ApiResponse(200, result, "Users fetched."));
});

export const createUserByAdmin = asyncHandler(async (req, res) => {
  const user = await createUserByAdminService(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, user, "User created successfully."));
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await approveUserService(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, user, "User approved successfully."));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await updateUserRoleService(req.params.id, req.body.role, req.user._id);
  res.status(200).json(new ApiResponse(200, user, "User role updated."));
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await toggleUserStatusService(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, user, `User ${user.isActive ? "activated" : "deactivated"}.`));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserService(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully."));
});

export const adminResetPassword = asyncHandler(async (req, res) => {
  const result = await adminResetPasswordService(req.params.id, req.body.newPassword, req.user._id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await getAuditLogsService(req.query);
  res.status(200).json(new ApiResponse(200, result, "Audit logs fetched."));
});

export const getAdminFormStats = asyncHandler(async (req, res) => {
  const result = await getAdminFormStatsService(req.query);
  res.status(200).json(new ApiResponse(200, result, "Form stats fetched."));
});
