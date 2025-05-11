// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Để truy cập JWT_SECRET

// Hàm tạo token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token hết hạn sau 30 ngày (bạn có thể tùy chỉnh)
  });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Kiểm tra xem các trường bắt buộc có được cung cấp không
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp email và mật khẩu" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // 2. Tạo người dùng mới (mật khẩu sẽ được hash tự động bởi pre-save hook trong User model)
    const user = await User.create({
      email,
      password,
      username,
    });

    if (user) {
      // 3. Trả về thông tin người dùng và token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Tạo và gửi token về cho client
        message: "Đăng ký thành công!",
      });
    } else {
      res.status(400).json({ message: "Dữ liệu người dùng không hợp lệ" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp email và mật khẩu" });
    }
    // 1. Tìm người dùng bằng email
    // Chúng ta cần lấy cả password, nên dùng .select('+password') vì mặc định nó bị ẩn
    const user = await User.findOne({ email }).select("+password");

    // 2. Kiểm tra người dùng tồn tại VÀ mật khẩu khớp
    if (user && (await user.matchPassword(password))) {
      // 3. Trả về thông tin người dùng và token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        message: "Đăng nhập thành công!",
      });
    } else {
      // Phản hồi chung chung để tránh tiết lộ email nào tồn tại hoặc không
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};
