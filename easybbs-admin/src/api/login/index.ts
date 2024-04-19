/* 登录相关 */
enum API{
  login='/login',//登录
}
import requst from "../../utils/axios"

export const ReqLogin = (params: loginInfo,func:Function) :Promise<loginRes> => {
  return requst({ url: API.login, params, errorCallback: () => func() });
};

export interface resPens {
  code: number;
  status: string;
  info: string;
}
export interface loginInfo {
  account: String;
  password: String;
  checkCode: any;
}
export interface loginRes extends resPens {
  date: { account: string } | null;
}