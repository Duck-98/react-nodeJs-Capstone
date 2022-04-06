import { all, fork, call, put, take } from "redux-saga/effects";
import axios from "axios";
function logInAPI() {
  return axios.post("/api/login");
}

function* logIn() {
  try {
    yield put({
      type: "LOG_IN_REQUEST",
    });
    const result = yield call(logInAPI);
    yield put({
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield take("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield take("LOG_OUT_REQUEST");
}
function* watchAddPost() {
  yield take("ADD_POST_REQUEST");
}

export default function* rootSaga() {
  yield all([
    fork(watchLogIn), // fork => 함수 실행
    fork(watchLogOut), // call =>
    fork(watchAddPost),
  ]);
}
