import { asyncHandler } from "../utils/asyncHandler.js";
import {createFormService,getAllFormsService, getMyFormsService, getSingleFormService} from "../services/form.service.js";

export const createForm = asyncHandler(async (req, res) => {

  const form = await createFormService(req.user, req.body);

  res.status(201).json({
    success: true,
    message: "Form submitted successfully",
    data: form
  });

});

export const getAllForms = asyncHandler(async (req, res) => {

  const forms = await getAllFormsService(req.user);

  res.status(200).json({
    success: true,
    data: forms
  });

});

export const getMyForms = asyncHandler(async (req, res) => {

  const forms = await getMyFormsService(req.user, req.query);

  res.status(200).json({
    success: true,
    data: forms
  });

});

export const getSingleForm = asyncHandler(async (req, res) => {

  const form = await getSingleFormService(
    req.params.id,
    req.user
  );

  res.status(200).json({
    success: true,
    data: form
  });

});