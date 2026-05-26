import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const ALL_ROLES = [
  "admin",
  "hod",
  "assistantHeadAcademics",
  "assistantHeadResearch",
  "faculty",
  "classTeacher",
  "internshipCoordinator",
  "majorProjectCoordinator",
  "ediCoordinator",
  "studentActivityCoordinator",
  "studentPortfolioAlumniCoordinator",
  "budgetCoordinator",
];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: "faculty",
      index: true,
    },
    department: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    profileImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    signatureUrl: {
      type: String, // URL to the uploaded signature image
    },
    digitalStamp: {
      type: String, // A unique ID or hash for the user's digital stamp
    },
    lastLogin: {
      type: Date,
    },
    // Tokens
    refreshToken: { 
      type: String, 
      select: false 
    },
    refreshTokenExpiry: Date,
    // Password Reset
    passwordResetToken: { 
      type: String, 
      select: false 
    },
    passwordResetExpiry: Date,
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ role: 1, department: 1 });

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name, role: this.role, department: this.department },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id }
    , process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
  );
};

export const User = mongoose.model("User", userSchema);
