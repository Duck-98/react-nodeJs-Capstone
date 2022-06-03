const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("upload폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    // diskStorage => 하드디스크
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); //
      done(null, basename + "_" + new Date().getTime() + ext); // 이름 + 시간 + 확장자 ex) file1412321.jpg
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

// async await은 next를 사용해줘야함.
/* 게시글 작성 API */
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    // 해시태그 정규표현식
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    // Post 데이터베이스에 데이터 추가하기
    if (hashtags) { // 만약 해쉬태그로 입력했다면
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          }),
        ), // Hashtag 데이터베이스에도 추가하기
      ); 
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [덕.png, 오리.png]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image })),
        );
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 덕.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      //  
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
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    }); 
    res.status(201).json(fullPost);
    // front에 fullpost 데이터 전송
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
/* image upload api */

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    //post post/images  array를 사용한 이유 -> 이미지를 여러 장 올리기 위해서.
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  },
);

module.exports = router;
