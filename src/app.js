import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js"

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send('At home directory');
})

// Health check route
//////***Creating an API endpoint */
app.use("/api/v1/users", userRoutes);

// Always last
app.use(errorHandler); 

export default app;