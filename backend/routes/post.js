const express = require("express");
const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
// async await은 next를 사용해줘야함.
/* 게시글 작성 API */
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    // 로그인한 사람만 게시글을 작성할 수 있게 isLoggedIn 미들웨어를 사용해줌.
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost); // front로 보내주기.
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/* 게시글 삭제 API */
// 게시글 데이터는 대부분 json으로 표현함.

/* 댓글 작성 API */
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10), // PostId는 파라미터 값이기 때문에 params
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });

    res.status(201).json(fullComment); // front로 보내주기.
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/*  게시물 좋아요 api */
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  //Patch /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } }); //  좋아요할 post id 찾기
    if (!post) {
      return res.status(403).send("게시물이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/*  게시물 좋아요 취소 api */
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  //Delete /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } }); //  좋아요할 post id 찾기
    if (!post) {
      return res.status(403).send("게시물이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // Delete /post/10
  try {
    await Post.destroy({
      where: { id: req.params.postId },
      UserId: req.user.id, // UserId 가 일치하는 사람만 지울 수 있게
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
