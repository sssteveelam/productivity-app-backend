const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model để tìm người dùng
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header (loại bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm người dùng dựa trên ID trong token và gắn vào request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "Không được phép, người dùng không tồn tại",
        });
      }

      next(); // Chuyển sang middleware hoặc route handler tiếp theo
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      res.status(401).json({ message: "Không được phép, token không hợp lệ" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không được phép, không tìm thấy token" });
  }
};

module.exports = { protect };
