const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post } = require("../models");
const router = express.Router();

router.post("/login", (req, res, next) => {
  // middleware를 확장시키는 문법
  passport.authenticate("local", (err, user, info) => {
    // info => 클라이언트 Error
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(403).send(info.reason);
      // info안에 있는 reason( ex) 존재하지않는 이메일..)을 status로 보내줌.
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      } // Error발생시
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        exclude: ["password"], // 전체 데이터에서 비밀번호만 제외하고 다 가져오겠다.
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });

      return res.status(200).json(fullUserWithoutPassword); // 사용자 정보를 프론트로 넘겨주기! 중요.
      //user -> front) saga(action.data) / reducer(me) 데이터로 변환됨
    });
  })(req, res, next);
});

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
router.post("/user/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
