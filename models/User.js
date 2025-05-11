// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Vui lòng cung cấp email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng cung cấp một địa chỉ email hợp lệ",
      ],
    },

    password: {
      type: String,
      required: [true, "Vui lòng cung cấp mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Mặc định không trả về trường password khi query
    },
    username: {
      type: String,
      required: [true, "Vui lòng cung cấp tên người dùng"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware: Mã hóa mật khẩu trước khi lưu user
UserSchema.pre("save", async function (next) {
  // Chỉ chạy hàm này nếu mật khẩu đã được thay đổi (hoặc là mới).
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Tạo "muối" để tăng độ phức tạp
    this.password = await bcrypt.hash(this.password, salt); // Hash mật khẩu
    next();
  } catch (error) {
    next(error);
  }
});

// Method (phương thức instance): So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
