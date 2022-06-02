import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { MdEmojiPeople } from "react-icons/md";
import { Menu, Input, Row, Col } from "antd";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import { useSelector } from "react-redux";
import Router from "next/router";
import styled, { createGlobalStyle } from "styled-components";
import useInput from "../hooks/useInput";

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
const Intro = styled.div`
  background-color: #001529;
  color: #fff;
  font-size: 14px;
`;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput("");

  const { me } = useSelector((state) => state.user);
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);
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
          <Input.Search
            enterButton
            style={{ verticalAlign: "middle" }}
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
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
          <Intro>
            <a
              href="https://github.com/Duck-98"
              rel="noreferrer noopener"
              target="_blank"
            >
              Made by 나덕경
            </a>{" "}
            <br />
            https://github.com/Duck-98 <br />
            godqhr2256@gmail.com
          </Intro>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
