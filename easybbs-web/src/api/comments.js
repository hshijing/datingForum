/* 评论相关 */
import Requst from '@/utils/Requst'
const api = {
  getCommentList: '/comment/loadComment', //获取评论列表
  postComment: '/comment/postComment', //发布评论
  doLike: '/comment/doLike', //评论点赞
  changeTopType: '/comment/changeTopType', //评论置顶
}

//获取评论列表
export const ReqGetCommentList =(data)=>{
return Requst({ url: api.getCommentList, params: data })
}
//发布评论
export const ReqPostComment = (data) => {
  return Requst({ url: api.postComment, params: data })
}
//评论点赞
export const ReqDoLike = (commentId) => {
  return Requst({ url: api.doLike, params: { commentId } })
}
//评论置顶
export const ReqChangeTopType = 
(commentId, topType) => {
  return Requst({ url: api.changeTopType, params: { commentId, topType } })
}