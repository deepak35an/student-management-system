import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const URI = process.env.MONGO_URI;
// mongoose.connect(URI);

export const ConnectDb = async()=>{
    try {
        await mongoose.connect(URI);
        console.log("connected to database");
    } catch (error) {
        console.error("database connection failed");
        process.exit(0);
    }
};

