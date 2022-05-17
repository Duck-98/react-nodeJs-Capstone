const express = require("express");
const postRouter = require("./routes/post");
const db = require("./models");
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("db연결성공");
  })
  .catch(console.error);

/* 
app.get 가져오기
app.post 생성하기
app.put 전체 수정
app.delete 제거
app.patch 부분 수정
app.options 찔러보기(?) ex) 요청이 가능한지  
app.head 헤더만 가져오기 
*/

// req -> 요청 res -> 응답
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

app.listen(3065, () => {
  console.log("서버실행중");
});
