const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
