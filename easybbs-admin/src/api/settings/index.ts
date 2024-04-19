import axios from '../../utils/axios'
enum API {
  getSetting = '/setting/getSetting', //获取系统设置
  saveSetting = '/setting/saveSetting', //保存设置
}
//获取系统设置
export const ReqgetSetting = ():Promise<getSetting> => {
  return axios({ url: API.getSetting })
}

//保存设置
export const ReqsaveSetting = (params: saveSetting): Promise<saveSettingRes> => {
      debugger
  return axios({ url: API.saveSetting, params })
  
}

interface req {
  status: string
  code: number
  info: string
}
//获取系统设置 返回
interface getSetting extends req {
  data: {
    auditStting: {
      postAudit: boolean
      commentAudit: boolean
    }
    commentSetting: {
      commentIntegral: number
      commentDayCountThreshold: number
      commentOpen: boolean
    }
    postSetting: {
      postIntegral: number
      postDayCountThreshold: number
      dayImageUploadCount: number
      attachmentSize: number
    }
    likeSetting: {
      likeDayCountThreshold: number
    }
    emailSetting: {
      emailTitle:string
      emailContent: string
    }
    registerSetting: {
      registerWelcomInfo: string
    }
  }
}
//保存设置携带
export interface saveSetting{
  registerWelcomInfo:string       //| 用户注册欢迎消息   | 是       |
  emailTitle:string               //| 邮件标题           | 是       |
  emailContent:string             //| 邮件内容           | 是       |
  postAudit:boolean                //| 帖子是否需要审核   | 是       |
  commentAudit:boolean             //| 评论是否需要审核   | 是       |
  postIntegral:number             //| 发帖积分           | 是       |
  dayImageUploadCount?:number      //| 每天可上传图片数量 |
  postDayCountThreshold:number    //| 每天可发贴数量     | 是       |
  attachmentSize:number           //| 允许附件大小       | 是       |
  commentOpen:boolean              //| 是否开启评论       | 是       |
  commentIntegral:number          //| 评论积分           | 是       |
  commentDayCountThreshold:number //| 每天可发评论数量   | 是       |
  likeDayCountThreshold:number    //| 每天可点赞数量     | 是       |

}

//保存设置返回
interface saveSettingRes extends req {
  data:null
}