// productivity-app-backend/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu đặc biệt của Mongoose để lưu ID
    required: true,
    ref: "User", // Tham chiếu đến model 'User' mà chúng ta đã tạo
  },
  text: {
    type: String,
    required: [true, "Vui lòng nhập nội dung công việc"],
    trim: true, // Loại bỏ khoảng trắng thừa ở đầu và cuối
  },
  isCompleted: {
    type: Boolean,
    default: false, // Mặc định công việc mới là chưa hoàn thành
  },
  createdAt: {
    type: Date,
    default: Date.now, // Mặc định là thời điểm công việc được tạo
  },
  // Bạn có thể thêm các trường khác sau này nếu cần, ví dụ: dueDate (ngày hết hạn)
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
