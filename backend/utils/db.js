import dotenv from "dotenv";
import mongoose from "mongoose";
// const URI = "mongodb+srv://deepak35an:Deepak35an%40@mern.r2kuqn2.mongodb.net/student_management?retryWrites=true&w=majority&appName=mern";
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

