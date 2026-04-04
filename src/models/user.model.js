import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      lowercase: true,
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

    // Security
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,

    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,

    // Password reset
    passwordChangedAt: Date,

    refreshToken: {
      type: String,
      select: false
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

    // STUDENT FIELDS (ISO FORMS)
    rollNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    grNumber: String,
    class: String,
    division: String,
    year: String,

    // FACULTY FIELDS
    employeeId: {
      type: String,
      required: function () {
        return this.role === "faculty";
      },
    },
    specialization: String,
    joiningDate: Date,

    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

    profileImage: {
      type: String, // Cloudinary URL
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

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

//Account lock helpers
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.isAccountLocked()) {
    throw new Error("Account is locked. Try again later.");
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
  }

  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
          _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

const User = mongoose.model("User", userSchema);

export default User;