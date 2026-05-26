import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { ApiError } from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempUploadsDir = path.resolve(__dirname, "../../temp/forms");

if (!fs.existsSync(tempUploadsDir)) {
  fs.mkdirSync(tempUploadsDir, { recursive: true });
}

const allowedExtensions = new Set([".doc", ".docx", ".xls", ".xlsx"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .slice(0, 80);
    const formNo = String(req.body.formType || "form").replace(/[^a-zA-Z0-9_-]+/g, "_");
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${formNo}_${safeBase || "submission"}_${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    cb(new ApiError(400, "Only DOC, DOCX, XLS, and XLSX files are allowed."));
    return;
  }
  cb(null, true);
};

export const formSubmissionUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 1,
  },
});

// NEW: Middleware for signature image uploads
export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(new ApiError(400, "Only JPG, JPEG and PNG files are allowed for signatures."));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for signatures
  }
});
