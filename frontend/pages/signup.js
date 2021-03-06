import Head from "next/head";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../store/configureStore";
import Router from "next/router";
import AppLayout from "../components/AppLayout";
import { Form, Input, Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from "../reducers/user";
const ErrorMessage = styled.div`
  color: red;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (me && me.id) {
      Router.replace("/");
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace("/");
    }
  }, [signUpDone]); // 회원가입이 완료되면 메인홈페이지로 이동
  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]); // 오류 발생시 오류 경고창  띄우기
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNick] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, []);  // 비밀번호와 비밀번호 확인이 같지 않으면 틀림

  /*
  const [nick, setNick] = useState("");
  const onChangeNick = useCallback((e) => {
    setNick(e.target.value);
  }, []);

  const [id, setId] = useState("");
  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const [password, setPassword] = useState("");
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const [passwordCheck, setPasswordCheck] = useState("");
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
  }, []);

  const [email, setEmail] = useState("");
  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  */
  const emailCheck = (e) => {
    const regExp = /\d{8}@\w[bu]+\.\w[ac]+\.\w[kr]/i;
    // 이메일 형식 : 숫자 8개@bu.ac.kr
    console.log("이메일 유효성 검사 :: ", regExp.test(e.target.value));
  };

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      // 비밀번호와 비밀번호 확인이 틀리면 에러 값 리턴
      return passwordError(true);
    }
    dispatch({
      // SIGN_UP_REQUEST 액션 
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [password, passwordCheck, email]);

  return (
    <>
      <AppLayout>
        <Head>
          <title>Taxi-Pod | 회원가입 </title>
        </Head>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input
              name="user-email"
              value={email}
              type="email"
              required
              onChange={onChangeEmail}
            />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickname}
              required
              onChange={onChangeNick}
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input
              name="user-password"
              value={password}
              required
              onChange={onChangePassword}
              type="password"
            />
          </div>

          <div>
            <label htmlFor="user-password-check">비밀번호체크</label>
            <br />
            <Input
              name="user-password-check"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
              type="password"
            />
            {password !== passwordCheck && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const cookie = req ? req.headers.cookie : "";
      axios.defaults.headers.Cookie = "";
      if (req && cookie) {
        // 서버에 쿠키가 있을 때만 포함됨.
        axios.defaults.headers.Cookie = cookie;
      }
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    },
);
export default SignUp;
