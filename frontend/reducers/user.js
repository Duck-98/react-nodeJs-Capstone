export const initialState = {
  isLogin: false,
  user: null,
  signUpData: {},
  loginData: {},
};

export const loginAction = (data) => {
  return {
    type: "LOG_IN",
    data,
  };
};

export const logoutAction = (data) => {
  return {
    type: "LOG_OUT",
    data,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isLogin: true,
        user: action.data,
      };
    case "LOG_OUT":
      return {
        ...state,
        isLogin: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
