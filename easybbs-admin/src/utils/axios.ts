import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElLoading, ElMessage } from "element-plus";
import router from "../router";
let Loading: any;
const contenTypeFrom = "application/x-www-form-urlencoded;charset=utf-8";
const contenTypeJson = "application/json";
interface MyAxiosRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  errorCallback?: (response: AxiosResponse) => void;
  showError?: boolean;
  dataType?: string;
}
const interce = axios.create({
  baseURL: "/api",
  timeout: 1 * 10000,
});
//请求拦截器
interce.interceptors.request.use(
  (config: any) => {
    if (config.showLoading) {
      Loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading && Loading) {
      Loading.close();
      ElMessage.error("请求失败");
    }
    return Promise.reject(error);
  }
);
//响应拦截器
interce.interceptors.response.use(
  (response: AxiosResponse) => {
    const config: MyAxiosRequestConfig = response.config;
    const { showLoading, errorCallback, showError } = config;
    //关闭loading效果
    if (showLoading && Loading) {
      Loading.close();
    }
    const data = response.data;
    if (data.code == 200) return response.data;
    else if (data.code == 901) {
      ElMessage.error('登录超时')
      router.push("/login");
      return Promise.reject({ showError: true, msg: "登录超时" });
    } else {
        if (errorCallback) {
          errorCallback(response);
        }
      return Promise.reject({ showError: showError, msg: data.info });
    }
  },
  (error) => {
    if (error.config.showError && Loading) {
      Loading.close();
    }
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
);

const requst = async<t> (config: MyAxiosRequestConfig) :Promise<t>=>{
  const {
    url,
    params,
    dataType,
    showLoading = true,
    errorCallback,
    showError = true,
  } = config;

  // 设置请求头
  let contentType = contenTypeFrom;

  // 创建携带体
  let formData = new FormData();

  // 携带内容
  for (const key in params) {
    formData.append(key, params[key] === undefined ? "" : params[key]);
  }
  // json格式
  if (dataType !== null && dataType === "json") {
    contentType = contenTypeJson;
  }
  // 设置请求头
  const headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    //@ts-ignore  调用axios
    return await interce.post(url, formData, {
      headers,
      showLoading,
      errorCallback,
      showError,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
export default requst;
