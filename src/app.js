import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";

import userRoutes from "./routes/user.routes.js"
import formRoutes from "./routes/form.routes.js"
import formTemplateRoutes from "./routes/formTemplate.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));
app.use(express.json({ limit:"10mb" }));


//////***Creating an API endpoint */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/forms", formRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/form-templates", formTemplateRoutes);

// Health check
app.get("/", (req,res)=>{
  res.send("API Running");
});

// Always last
app.use(errorHandler); 

export default app;