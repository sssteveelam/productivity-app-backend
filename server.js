// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
// Import auth routes
const authRoutes = require("./routes/authRoutes");
// ---------------------------------------------
// Load biến môi trường từ file .env
dotenv.config();
// Kết nối tới cơ sở dữ liệu
connectDB();

const app = express();
// ---------------------------------------------

// Middleware
app.use(cors()); // Cho phép CORS cho tất cả các routes
app.use(express.json()); // Parse JSON request bodies

// Test Route (để kiểm tra server có chạy không)
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes); // Tất cả các route trong authRoutes sẽ có tiền tố /api/auth

const PORT = process.env.PORT || 5001; // Sử dụng cổng từ .env hoặc mặc định 5001

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
