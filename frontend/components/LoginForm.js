import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";

const LoginForm = ({ setIsLogin }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const onChangeId = useCallback(() => {
    setId(e.target.value);
  }, []);
  const onChangePassword = useCallback(() => {
    setPassword(e.target.value);
  }, []);
  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLogin(true);
  }, [id, password]);
  return (
    <>
      <Form onFinish={onSubmitForm}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <input name="user-id" value={id} onChange={onChangeId} required />
        </div>

        <div>
          <label htmlFor="user-password"></label>
          <br />
          <Input
            name="user-id"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>

        <div>
          <Button type="primary" loading={false}>
            로그인
          </Button>
          <Link href="/sign">
            <Button>회원가입</Button>
          </Link>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
