import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("")
        console.log("db connect sucessfully");
    } catch (error) {
        console.log("db connect failed !!");
    }
}
