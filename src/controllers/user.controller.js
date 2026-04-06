import { registerUserService } from "../services/user.service.js";

const registerUser = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    next(error); // 🔥 central error handling
  }
};

export { registerUser };