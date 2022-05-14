module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment", // id가 기본적으로 들어가있기 때문에 만들지 않아도 됨.
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
  Comment.associate = (db) => {};
  return Comment;
};
