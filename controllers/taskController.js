// productivity-app-backend/controllers/taskController.js
const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Lấy tất cả công việc của người dùng đã đăng nhập
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // req.user được gắn bởi middleware 'protect'
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công việc:", error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Tạo một công việc mới
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "Nội dung công việc không được để trống" });
    }

    const task = new Task({
      text,
      user: req.user._id, // Gắn ID của người dùng đã đăng nhập
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error("Lỗi khi tạo công việc:", error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Lấy một công việc theo ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // Kiểm tra xem công việc có thuộc về người dùng đang đăng nhập không

      if (task.user.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ message: "Không có quyền truy cập công việc này" });
      }
      res.json(task);
    } else {
      res.status(404).json({ message: "Không tìm thấy công việc" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy công việc theo ID:", error.message);
    if (error.kind === "ObjectId") {
      // Xử lý lỗi nếu ID không đúng định dạng ObjectId
      return res
        .status(404)
        .json({ message: "Không tìm thấy công việc (ID không hợp lệ)" });
    }
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Cập nhật một công việc
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { text, isCompleted } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
      // Kiểm tra quyền sở hữu
      if (task.user.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ message: "Không có quyền cập nhật công việc này" });
      }

      // Cập nhật các trường
      if (text !== undefined) {
        task.text = text.trim() === "" ? task.text : text;
      }

      if (isCompleted !== undefined) {
        task.isCompleted = isCompleted;
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Không tìm thấy công việc" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật công việc:", error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Không tìm thấy công việc (ID không hợp lệ)" });
    }
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Xóa một công việc
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // Kiểm tra quyền sở hữu
      if (task.user.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ message: "Không có quyền xóa công việc này" });
      }

      await Task.deleteOne();
      res.json({ message: "Công việc đã được xóa" });
    } else {
      res.status(404).json({ message: "Không tìm thấy công việc" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa công việc:", error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Không tìm thấy công việc (ID không hợp lệ)" });
    }
    res.status(500).json({ message: "Lỗi Server" });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
