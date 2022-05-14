module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image", // id가 기본적으로 들어가있기 때문에 만들지 않아도 됨.
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, //필수},
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    },
  );
  Image.associate = (db) => {};
  return Image;
};
