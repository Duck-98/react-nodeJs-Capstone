const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const router = express.Router();
router.post("/", async (req, res, next) => {
  // async await을 이용하여 비동기 문제 해결
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    }); // 같은 이메일을 사용하고 있는 사람이 있는지
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    } // return이 없으면 아래있는 res도 실행이 됨.
    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
}); //post /user/

module.exports = router;
