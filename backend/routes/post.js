const express = require("express");
const router = express.Router();
router.post("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});
// 게시글 데이터는 대부분 json으로 표현함.
router.delete("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

module.exports = router;
