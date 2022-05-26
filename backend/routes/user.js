const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
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
      // user가 로그인 되어있어야 req.user.id를 불러올 수 있기 때문에 if문을 이용하여 데이터가 있을 때만 user를 front에 보내주게 해줌.
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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

router.post("/", isNotLoggedIn, async (req, res, next) => {
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

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      },
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch(`/:userId/follow`, isLoggedIn, async (req, res, next) => {
  // patch /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("팔로우 할 수 없습니다.");
    }
    user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete(`/:userId/follow`, isLoggedIn, async (req, res, next) => {
  // delete /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("언팔로우 할 수 없습니다.");
    }
    user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 팔로워 목록 불러오기 */
router.get("/followers", isLoggedIn, async (req, res, next) => {
  // get /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 사용자의 아이디(나의 아이디 찾기)
    if (!user) {
      res.status(403).send("팔로우 할 수 없습니다.");
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/* 팔로잉 목록 불러오기 */
router.get("/followings", isLoggedIn, async (req, res, next) => {
  // get /user/followingss
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("팔로우 할 수 없습니다.");
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 
req.params.id -> 내가 아닌 다른 사람
req.user.id -> 나
*/
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
