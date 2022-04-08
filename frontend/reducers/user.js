export const initialState = {
  isLogin: false,
  isLoggingIn: false, // 로그인 시도중
  isLoggingOut: false, //로그아웃 시도중.
  me: null,
  signUpData: {},
  loginData: {},
};

export const loginRequestAction = (data) => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export const loginSuccessAction = (data) => {
  return {
    type: "LOG_IN_SUCCESS",
    data,
  };
};

export const logoutRequestAction = (data) => {
  return {
    type: "LOG_OUT_REQUEST",
    data,
  };
};
export const logoutSuccessAction = (data) => {
  return {
    type: "LOG_OUT_SUCCESS",
    data,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLogin: true,
        me: action.data,
      };
    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLogin: false,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLogin: false,
        me: null,
      };
    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
