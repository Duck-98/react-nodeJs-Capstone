import React from "react";
import { Card, Popover, Button } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import PostImages from "./PostImages";

const PostCard = ({ post }) => {
  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages />}
        actions={[
          <RetweetOutlined key="retweet" />,
          <HeartOutlined key="heart" />,
          <MessageOutlined key="comment" />,
          <Popover
            key="more"
            content={
              <ButtonGroup>
                <Button>수정</Button>
                <Button type="danger">삭제</Button>
                <Button>신고</Button>
              </ButtonGroup>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
      ></Card>
    </div>
  );
};

export default PostCard;
