const passport = require("passport");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
// LocalStrategy로 이름 바꾸기
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email }, // User database에 사용자가 존재하는지 확인.
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 사용자입니다." });
          }
          const result = await bcrypt.compare(password, user.password);
          // db password와 사용자가 입력한 password를 비교
          if (result) {
            return done(null, user); //비밀번호가 일치하면
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      },
    ),
  );
};
