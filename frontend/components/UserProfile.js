import React from "react";
import { Avatar, Card } from "antd";

const UserProfile = () => {
  return (
    <Card
      actions={[
        <div key="post">
          게시물
          <br /> 0
        </div>,
        <div key="followings">
          팔로잉
          <br /> 0
        </div>,
        <div key="followers">
          팔로워 <br /> 0
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>Duck</Avatar>} title="Taxi-Pod" />
      <Button>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
