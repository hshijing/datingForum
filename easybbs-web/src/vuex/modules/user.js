
export const user = {
  state: {
    loginUserInfo: {}, //用户昵称头像
    showLogin: false, //登录弹出框
  },
  mutations: {
    updateLoginInfo(state, value) {
      state.loginUserInfo = value
    },
    removeLoginInfo(state, value) {
      state.loginUserInfo = value
    },
    showlogin(state, value) {
      state.showLogin = value
    },
  },
}
