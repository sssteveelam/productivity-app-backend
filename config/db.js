const mongoose = require("mongoose");
require("dotenv").config(); // Để đọc biến từ .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // THONG BAO
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", err.message);
    // Thoát khỏi process nếu không kết nối được DB
    process.exit(1);
  }
};

module.exports = connectDB;
