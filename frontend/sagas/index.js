import { all, fork } from "redux-saga/effects";
import postSaga from "./post";
import userSaga from "./user";

export default function* rootSaga() {
  yield all([
    fork(postSaga), // fork => 함수 실행
    fork(userSaga),
  ]);
}
