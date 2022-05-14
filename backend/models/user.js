module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", // id가 기본적으로 들어가있기 때문에 만들지 않아도 됨.
    {
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수
        unique: true, //고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수},
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, //필수},
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    },
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post); // 유저가 여러 포스트를 갖을 수 있다. 1:N
    db.User.hasMany(db.Comment); // 유저가 여러 댓글을 갖을 수 있다. 1:N
    db.User.belongsToMany(db.Post, { through: "Like", as: "Likers" });
    db.User.belongsToMany(db.Post, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
    });
    db.User.belongsToMany(db.Post, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId",
    });
  };
  return User;
};
