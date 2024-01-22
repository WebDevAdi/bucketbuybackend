import mongoose from "mongoose";
import apiError from "../utils/apiError.js";

const connectDB = async () => {
    try {
        const connInstance = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected. DB Host : ${connInstance.connection.host}`)
    } catch (error) {
        throw new apiError(error.code,error.message);
    }
}

export default connectDB;