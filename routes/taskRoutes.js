// productivity-app-backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// Định nghĩa routes cho /api/tasks
router
  .route("/")
  .get(protect, getTasks) // GET /api/tasks - Lấy tất cả tasks của user (cần protect)
  .post(protect, createTask); // POST /api/tasks - Tạo task mới (cần protect)

// Định nghĩa routes cho /api/tasks/:id
router
  .route("/:id")
  .get(protect, getTaskById) // GET /api/tasks/:id - Lấy 1 task theo ID (cần protect)
  .put(protect, updateTask) // PUT /api/tasks/:id - Cập nhật task (cần protect)
  .delete(protect, deleteTask); // DELETE /api/tasks/:id - Xóa task (cần protect)

module.exports = router;
