import axios from '../../utils/axios'
enum API {
  loadComment = '/forum/loadComment', //获取所有评论
  delComment = '/forum/delComment', //删除评论
  auditComment = '/forum/auditComment', //审核评论
}
//获取所有评论
export const ReqloadComment = (params: LoadComment): Promise<ReqloadComment> => {
  return axios({ url: API.loadComment, params })
}
//删除评论
export const ReqdelComment = (
  commentIds: number,
): Promise<ReqNull> => {
  return axios({ url: API.delComment, params: { commentIds } })
}
//审核评论 
export const ReqauditComment = (commentIds: number): Promise<ReqNull> => {
  return axios({ url: API.auditComment, params: { commentIds } })
}
interface Req {
  status: string
  code: number
  info: string
}
interface ReqNull extends Req {
  data:null
}
interface ReqloadComment extends Req {
  data:DATE
}
export interface DATE{
  totalCount: string
  pageSize: string
  pageNo: string
  pageTotal: string
  list: LIST
}
export type LIST = Array<LISTObj>
export interface LISTObj {
  commentId: number //评论ID
  pCommentId: number //父级评论ID
  articleId: string //文章ID
  content: string //评论内容
  imgPath: string //评论图片
  userId: string //评论人ID
  nickName: string //评论人昵称
  userIpAddress: string //评论人所在地
  replyUserId?: null //回复他人ID
  replyNickName?: null //回复他人昵称
  topType: number //置顶类型 0:未置顶 1:置顶
  postTime: string //发布时间
  goodCount: number //点赞数
  status: number //状态
  likeType?: null //登录用户是否已经点赞 null未点赞 1:已点赞
  children: LIST //下级评论
}
//获取所有评论 携带参数
export interface LoadComment {
  pageNo: number|string|undefined
  pageSize: number|string|undefined
  contentFuzzy?: string
  nickNameFuzzy?: string
  status?: number
}
