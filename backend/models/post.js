module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post", // id가 기본적으로 들어가있기 때문에 만들지 않아도 됨.
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false, //필수},
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 한글 저장
    },
  );
  Post.associate = (db) => {};
  return Post;
};
