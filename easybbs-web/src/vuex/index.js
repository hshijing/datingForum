import { createStore } from 'vuex'
import { plate } from './modules/plate'
import { aticle } from './modules/aticle'
export const store = createStore({
  state: {
    loginUserInfo: {}, //用户昵称头像
    showLogin: false, //登录弹出框
    messageCont: {}, //消息数量
    commentOpen: undefined, //评论框是否打开
  },
  mutations: {
    /* 更新用户信息 */
    updateLoginInfo(state, value) {
      state.loginUserInfo = value
    },
    /* 退出登录 */
    removeLoginInfo(state, value) {
      state.loginUserInfo = value
    },
    /* 是否弹出登录框 */
    showlogin(state, value) {
      state.showLogin = value
    },
    /* 更新消息数量 */
    updateMessageCont(state, value) {
      state.messageCont = value
    },
    /* 更新对应的消息数量 */
    readMessage(state, value) {
      //总数减去当前观看的类型数
      state.messageCont.total =
        state.messageCont.total - state.messageCont[value]
      state.messageCont[value] = 0
    },
    /* 系统设置  评论是否打开 */
    updateCommentOpen(state, value) {
      state.commentOpen = value
    },
  },
  modules: {
    plate,
    aticle,
  },
})
