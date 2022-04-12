import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);
  return (
    <>
      <FormWrapper onFinish={onSubmitForm}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            value={email}
            type="email"
            onChange={onChangeEmail}
            required
          />
        </div>

        <div>
          <label htmlFor="user-password"></label>
          <br />
          <Input
            name="user-password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>

        <div>
          <ButtonWrapper>
            <Button type="primary" htmlType="submit" loading={logInLoading}>
              로그인
            </Button>
            <Link href="/signup">
              <Button>회원가입</Button>
            </Link>
          </ButtonWrapper>
        </div>
      </FormWrapper>
    </>
  );
};

LoginForm.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default LoginForm;
