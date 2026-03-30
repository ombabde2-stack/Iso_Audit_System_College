import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try{
       // Check if MONGO_URI exists
        if (!process.env.MONGO_URI) {
           throw new Error("MONGO_URI is not defined in .env file");
        }
       
        //Connect to DB
       const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`)
       console.log(` MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}

export default connectDB