//二次封装axios
import { store } from '@/vuex';
import axios from 'axios';
import {ElLoading,ElMessage} from 'element-plus';
const contenTypeFrom = 'application/x-www-form-urlencoded;charset=utf-8'
const contenTypeJson = 'application/json'
const interce= axios.create({
  baseURL: '/api',
  timeout: 10 * 1000,
})
let Loading//loading效果
//请求拦截器
interce.interceptors.request.use(
  (config) => {
    //TODO:loading效果
    if (config.showLoading) {
      Loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    return config
  },
  (error) => {
    if (error.config.showLoading && Loading) {
      Loading.close()
      ElMessage.error('请求失败')
    }
    return Promise.reject('请求失败', error)
  },
)
//响应拦截器
interce.interceptors.response.use(
  (response) => {
    const {showLoading,errorCallback,showError}=response.config
    //关闭loading效果
    if (showLoading && Loading) {
      Loading.close()
    }
    const data = response.data
    if(data.code==200) return response.data
    else if(data.code==901){
      store.commit('showlogin', true)
      store.commit('updateLoginInfo', undefined)
      return Promise.reject({showError:false,msg:'登录超时'})
    }
    else{
      if(errorCallback){
        errorCallback(response)
      }
      return Promise.reject({showError:showError,msg:data.info})
    }
  },
  (error) => {
    if(error.config.showError&&Loading){
      Loading.close()
    }
    ElMessage.error('网络错误')
    return Promise.reject(error)
  },
)
const requst=async (config)=>{
  const {
    url,
    params,
    dataType,
    showLoading = true,
    errorCallback,
    showError=true,
  } = config
  //设置请求头
  let contenType=contenTypeFrom
  //创建携带体
  let formDate=new FormData()
  //携带内容
  for (const key in params) {
    formDate.append(key, params[key]===undefined?'':params[key])
  }
  //json格式
  if (dataType!==null&&dataType === 'json') {
    contenType=contenTypeJson
  }
  //设置请求头
  const headers={
    'Content-Type':contenType,
    'X-Requested-With':'XMLHttpRequest',
  }
  try {
    //调用axios
    return await interce.post(url, formDate, {
      headers,
      showLoading,
      errorCallback,
      showError
    });
  } catch (err) {
    if (err.showError) {
      ElMessage.error(err.msg);
    }
    return null;
  }
}
export default requst