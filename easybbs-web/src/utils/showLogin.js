/**
 * 
 * @param {object} store 传递仓库数据
 */
export function showLogin(store){
  const userInfo = store.state.loginUserInfo
  if(userInfo!==null){
    if (Object.keys(userInfo).length === 0) {
      store.commit('showlogin', true)
      return false
    } else {
      return true
    }
  }else{
      store.commit('showlogin', true)

  }
}