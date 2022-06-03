const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    // user에는 {id: 1, email:xx@mail.com} 등이 들어 있습니다.
    // 세션에 모두 저장하기에는 무거우므로 고유값(id)만 저장합시다
    // mysql에서 자동생성하는 건 id,
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // 세션에서 고윳값을 가지고 DB에서 유저의 정보를 찾아냅니다.
    // 찾아낸 정보는 req.user에 담아줍니다
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
