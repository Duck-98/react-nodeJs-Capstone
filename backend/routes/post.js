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
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g); //
    // 로그인한 사람만 게시글을 작성할 수 있게 isLoggedIn 미들웨어를 사용해줌.
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            // findOrCreate - > 없을 때는 데이터베이스에 등록 , 없으면 데이터를 가져옴.
            where: { name: tag.slice(1).toLowerCase() },
          }),
        ), //result = [[#test, true], [#test2, true]]
      ); // result 배열에서 첫번째 #test만 추출해야하기때문에 v[0]dmf g해줌.
      await post.addHashTags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // image 여러개 올리면 image: [duck.png, item.jpg]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image })),
        );
        await post.addImages(images);
        // image 배열을 map 함수를 이용하여 Image 모델에 데이터를 넣어줌.
      } else {
        // 이미지 하나만 올리면 image : duck.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
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
