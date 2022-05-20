const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
//const morgan = require('morgan');
//const path = require('path');

const postRouter = require("./routes/post");
//const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("db연결성공");
  })
  .catch(console.error);
passportConfig();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
/* 
app.get 가져오기
app.post 생성하기
app.put 전체 수정
app.delete 제거
app.patch 부분 수정
app.options 찔러보기(?) ex) 요청이 가능한지  
app.head 헤더만 가져오기 
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// req -> 요청 res -> 응답
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // cookie에 보낸 데이터도 해킹당하지 않기 위해 secret키도 숨기기
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/", (req, res) => {
  res.send("hello api");
});

app.get("/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello" },
    { id: 2, content: "hello1" },
    { id: 3, content: "hello2" },
  ]);
});
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버실행중");
});
