import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoDBuri = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoDBuri)
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export { connectToMongo };
