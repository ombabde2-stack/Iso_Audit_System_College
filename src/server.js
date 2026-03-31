// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Connect DB :-database connection-async task -> always execute a promise after
connectDB()
.then(()=>{
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error)=>{
  console.log("Mongo DB connection failed!!", error.message)
})



