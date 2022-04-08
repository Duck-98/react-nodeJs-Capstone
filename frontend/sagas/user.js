import {
  all,
  fork,
  call,
  put,
  takeEvery,
  takeLatest,
  delay,
} from "redux-saga/effects";
import axios from "axios";

function logInAPI(data) {
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    //const result = yield call(logInAPI, action.data);
    yield delay(1000);
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

function logOutAPI() {
  return axios.post("/api/logout");
}

function* logOut() {
  try {
    //const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}
function* watchLogIn() {
  // 기존의 take 함수를 이용하면 한번만 로그인이 되기 때문에 takeEvery함수를 이용하여 여러번 실행할 수 있게 해줌.
  // takeLatest => 100번을 눌러도 마지막 한번만 실행하게 해줌.
  yield takeLatest("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
