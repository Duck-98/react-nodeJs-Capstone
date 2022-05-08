import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { MdEmojiPeople } from "react-icons/md";
import { Menu, Input, Row, Col } from "antd";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

.ant-row{
  margin-right: 0 !important;
  margin-left: 0 !important;
} 
.ant-col: first-child{
  padding-left: 0 !important;
}
.ant-col: last-child{
  padding-right: 0 !important;
}

`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div>
      <Global />
      <Menu mode="horizontal" theme="dark">
        <Menu.Item>
          <Link href="/">
            <a style={{ color: "#fff" }}>
              TAXI_POD <MdEmojiPeople style={{ verticalAlign: "middle" }} />
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a style={{ color: "#fff" }}>내 프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a style={{ color: "#fff" }}>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={6}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/Duck-98"
            rel="noreferrer noopener"
            target="_blank"
          >
            Made by Duck
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
