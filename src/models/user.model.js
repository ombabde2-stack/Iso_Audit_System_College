import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // security: not returned by default
    },

    ///Defines roles access
    role: {
      type: String,
      enum: ["admin", "faculty", "student", "coordinator"],
      default: "student",
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
      type: String, // e.g., HOD, Assistant Head, Coordinator
      trim: true,
    },

    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    profileImage: {
      type: String, // Cloudinary URL
    },

    lastLogin: {
      type: Date,
    },

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);


// INDEXES (IMPORTANT FOR PERFORMANCE)
userSchema.index({ email: 1 });
userSchema.index({ role: 1, department: 1 });


// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


// COMPARE PASSWORD METHOD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// REMOVE SENSITIVE DATA
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};


const User = mongoose.model("User", userSchema);

export default User;