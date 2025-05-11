// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Định nghĩa route cho đăng ký
// POST /api/auth/register
router.post("/register", registerUser);

// Định nghĩa route cho đăng nhập
// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
