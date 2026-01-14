import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: process.env.NODE_ENV !== "production" });
    console.log("Connection established");
  } catch (error) {
    console.error("Connection error", error);
    process.exit(1);
  }
};
