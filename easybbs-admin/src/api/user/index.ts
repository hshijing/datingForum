enum API {
  loadUserList = '/user/loadUserList', //获取用户列表
  updateUserStatus = '/user/updateUserStatus', //更新用户状态
  sendMessage = '/user/sendMessage', //给用户发送消息
} 
import axios from '../../utils/axios'
 //获取用户列表 
export const ReqloadUserList = (params: User):Promise<ReqloadComment> => {
  return axios({ url: API.loadUserList,params })
}
//更新用户状态
export const RequpdateUserStatus = (params:any): Promise<ReqNull> => {
  return axios({ url: API.updateUserStatus, params })
}
//给用户发送消息
export const ReqsendMessage = (params: Message): Promise<ReqNull> => {
  return axios({ url: API.sendMessage, params })
}
 //获取用户列表 携带参数
export interface User {
  pageNo:number        //| 页码               | 否       |
  pageSize:number      //| 每页大小           | 否       |
  nickNameFuzzy:string|undefined //| 昵称模糊搜索       | 否       |
  sex:number|undefined           //| 性别 0:女 1:男     | 否       |
  status:number|undefined        //| 状态 0:禁用 1:启用 | 否       |
}
//给用户发信息 携带参数
export interface Message {
  userId? :string  //| 用户ID   | 是       |
  message :string //| 消息内容 | 是       |
  integral:string //| 积分     | 是       |
}
interface Req {
  status: string
  code: number
  info: string
}
interface ReqNull extends Req {
  data: null
}
interface ReqloadComment extends Req {
  data: DATE
}
export interface DATE {
  totalCount: string
  pageSize: string
  pageNo: string
  pageTotal: string
  list: LIST
}
export type LIST = Array<LISTObj>
export interface LISTObj {
  userId: string
  nickName: string
  email: string
  sex?: null|number
  personDescription?: null
  joinTime: string
  lastLoginTime: string
  lastLoginIp:string
  lastLoginIpAddress: string
  totalIntegral: number
  currentIntegral: number
  status: number
}