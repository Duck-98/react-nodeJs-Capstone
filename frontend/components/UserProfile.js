import React, { useCallback } from "react";
import { Avatar, Card, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";
import styled from "styled-components";

const StyledCard = styled(Card)``;
/* style={{ backgroundColor:  "#001529" }}*/
const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction()); 
    // 로그아웃 버튼 눌렀을 때 로그아웃 액션 실행
  }, []);
  return (
    <StyledCard
      actions={[
        <div key="post">
          게시물
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br /> {me.Followings.length}
        </div>,
        <div key="followers">
          팔로워 <br /> {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        로그아웃 
      </Button>
    </StyledCard>
  );
};

export default UserProfile;
