/* 个人信息 */
export const api = {
  checkCode: '/api/checkCode', //获取图形验证码API
  getEmailCode: '/sendEmailCode', //获取邮箱验证码
  register: '/register', //注册
  login: '/login', //登录
  resetPwd: '/resetPwd', //重置密码
  getUserInfo: '/getUserInfo', //获取用户信息
  logout: '/logout', //退出登录
  getSysSetting: '/getSysSetting', //系统设置
}
import Requst from '@/utils/Requst'
//获取邮箱验证码
export const ReqEmailChekCode = (date, func, type) =>
  Requst({
    url: api.getEmailCode,
    params: date,
    errorCallback: () => {
      func(type)
    },
  })
//区分登录|注册|重置操作
function QuFenLeiXing(type) {
  const obj = {
    0: api.register,
    1: api.login,
    2: api.resetPwd,
  }
  return obj[type]
}
//处理携带参数
function ChuLiCanShu(type, date) {
  let _date = {}
  const { email, nickName, password, emailCode, checkCode } = date
  //注册
  if (type === 0) {
    _date = { email, nickName, password, emailCode, checkCode }
    //登录
  } else if (type === 1) {
    //登录需要md5加密 以及是否记住我 如果为true  设置cookies
    _date = { email, password, checkCode }
    //重置
  } else {
    _date = { email, password, checkCode }
  }
  return _date
}
//注册 登录 重置密码 是否7天免登录
export const ReqLoginOrregisterOrResetPwdme = (type, _date, func) => {
  const isLogOrRegOrRes = QuFenLeiXing(type.value)
  const date = ChuLiCanShu(type.value, _date)
  console.log(date)
  return Requst({
    url: isLogOrRegOrRes,
    params: date,
    errorCallback: () => {
      func(0)
    },
  })
}

//获取用户信息
export const ReqGetUserInfo = () =>
  Requst({
    url: api.getUserInfo,
  })

//退出登录
export const ReqLogout = () => Requst({ url: api.logout })

//系统设置
export const ReqGetSysSetting = () => {
  return Requst({ url: api.getSysSetting })
}
