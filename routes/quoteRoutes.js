// productivity-app-backend/routes/quoteRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/random", async (req, res) => {
  try {
    const zenQuoteApiResponse = await axios.get(
      "https://zenquotes.io/api/random"
    );

    if (zenQuoteApiResponse.data && zenQuoteApiResponse.data.length > 0) {
      res.json(zenQuoteApiResponse.data[0]);
    } else {
      res
        .status(404)
        .json({ message: "Không tìm thấy trích dẫn từ ZenQuotes" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy trích dẫn từ ZenQuotes API:", error.message);

    if (error.response) {
      console.error("ZenQuotes API Status:", error.response.status);
      console.error("ZenQuotes API Data:", error.response.data);
      res.status(error.response.status).json({
        message: "Lỗi khi lấy trích dẫn từ API bên ngoài.",
        details: error.response.data,
      });
    } else if (error.request) {
      console.error(
        "Không nhận được phản hồi từ ZenQuotes API:",
        error.request
      );
      res
        .status(503)
        .json({ message: "Không có phản hồi từ API trích dẫn bên ngoài." });
    } else {
      res.status(500).json({
        message: "Lỗi máy chủ nội bộ khi thiết lập yêu cầu lấy trích dẫn.",
      });
    }
  }
});

module.exports = router;
