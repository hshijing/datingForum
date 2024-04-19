enum Api {
  loadArticle = '/forum/loadArticle', //文章列表
  loadBoard = '/board/loadBoard', //板块列表
  updateBoard = '/forum/updateBoard', //更新文章板块
  delArticle = '/forum/delArticle', //删除文章
  topArticle = '/forum/topArticle', //置顶文章
  auditArticle = '/forum/auditArticle', //审核文章
  getAttachment = '/forum/getAttachment', //获取文章附件信息
  loadComment4Article = '/forum/loadComment4Article', //获取文章评论信息
}
import axios from '../../utils/axios'

//获取文章列表
export const ReqloadArticle = (params: params): Promise<loadArticle> => {
  return axios({ url: Api.loadArticle, params })
}
//获取所有板块
export const ReqloadBoard = (): Promise<loadBoard> => {
  return axios({ url: Api.loadBoard })
}
//更新文章板块
export const RequpdateBoard = (
  params: updateBoard,
): Promise<RequpdateBoard> => {
  return axios({ url: Api.updateBoard, params })
}
//文章删除
export const ReqdelArticle = (articleIds: string): Promise<reqArticleId> => {
  return axios({ url: Api.delArticle, params: { articleIds } })
}
//文章置顶
export const ReqtopArticle = (params: TopArticle): Promise<reqTopArticle> => {
  return axios({ url: Api.topArticle, params })
}
//文章审核
export const ReqauditArticle = (articleIds: string): Promise<reqArticleId> => {
  return axios({ url: Api.auditArticle, params: { articleIds } })
}
//获取文章评论 携带参数
interface loadComment4Article {
  pageNo?: number
  pageSize?: number
  articleId: string
}
//获取文章评论信息
export const ReqloadComment4Article = (
  params: loadComment4Article,
): Promise<loadArticle> => {
  return axios({ url: Api.loadComment4Article, params })
}
//获取文章附件信息
export const ReqgetAttachment = (articleId: string) => {
  return axios({ url: Api.getAttachment, params: { articleId } })
}
//#region

//基本请求数据
interface req {
  status: string
  code: number
  info: string
}
//获取文章列表返回数据
interface loadArticle extends req {
  data: {
    totalCount: number
    pageSize: number
    pageNo: number
    pageTotal: number
    list: list
  }
}
//获取文章列表返回数据
export interface Article {
  totalCount: number
  pageSize: number
  pageNo: number
  pageTotal: number
  list: list
}
//单个文章类型
export interface loadArticleList {
  articleId: string //文章ID
  boardId: number //板块ID
  boardName: string //板块名称
  pBoardId: number //父级板块
  pBoardName: string //父级板块名称
  userId: string //用户ID
  nickName: string //昵称
  userIpAddress: string //所在地
  title: string //标题
  cover: string //封面
  content: null //内容 列表内容为空
  summary: string //简介
  postTime: string //发布时间
  readCount: number //阅读数
  goodCount: number //点赞数
  commentCount: number //评论数
  topType: number //置顶类型 0:未置顶 1:已置顶
  attachmentType: number //附件类型 0:没附件 1:有附件
  status: number //状态 1 已审核
  /* 附件共用 */
  fileName?: string //附件名称
  fileId?: string //附件id
  fileSize?: number //附件大小
  downloadCount?: number //下载次数
  fileType?: number //压缩包
  integral?: number //所需积分
  imgPath?: string
  children?: list
  replyUserId?: string
  replyNickName?:string
}
export type list = loadArticleList[]
//单个文章类型
export interface params {
  pageNo?: number //当前页码
  pageSize?: number //一页显示条数
  titleFuzzy?: string //模糊搜索标题
  nickNameFuzzy?: string //模糊搜索昵称
  attachmentType?: number //附件
  status?: number //文章状态
  boardId?: number //板块ID
  pBoardId?: number //父级板块ID
  topType?: number
}
interface loadBoard extends req {
  data: loadBoardArr
}
//返回文章列表信息
export type loadBoardArr = loadBoardObj[]
//返回单个文章列表信息
interface loadBoardObj {
  boardId: number //板块ID
  pBoardId: number //父板块ID
  boardName: string //板块名称
  cover?: null //封面
  boardDesc: string //简介
  sort: number //排序
  postType: number //是否可以发帖 0:不可以 1:可以
  children?: loadBoardArr
}
//更新板块携带参数
export interface updateBoard {
  articleId: string //文章ID
  pBoardId: number //父级板块ID
  boardId: number //板块ID
}
interface RequpdateBoard extends req {
  data: null
}
interface reqArticleId extends req {
  date: null
}
//置顶携带参数
interface TopArticle {
  articleId: string
  topType: number
}
interface reqTopArticle extends req {
  date: null
}
//#endregion