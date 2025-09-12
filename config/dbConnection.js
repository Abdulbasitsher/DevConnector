import mongoose from "mongoose";

const ConnectDB = async () => {
    const DB_URI = process.env.MONGODB_URI;

    if (!DB_URI) {
        console.error("❌ MONGODB_URI is not defined in environment variables.");
        process.exit(1);
    }

    try { 
        await mongoose.connect(DB_URI, {
           
        });
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

export default ConnectDB;
