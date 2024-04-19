/* 文章 */
import Requst from '@/utils/Requst';
const api = {
  loadArticle: '/forum/loadArticle', //获取文章列表
  ArticleDetail: '/forum/getArticleDetail', //获取文章详细
  doLike: '/forum/doLike', //文章点赞
  userIntergal: '/forum/getUserDownloadInfo', //获取积分
  attachmentDownload: '/forum/attachmentDownload', //下载地址,
  'search': '/forum/search',//搜索
}
//获取文章利列表
export const ReqGetloadArticle = (params) =>{
  return  Requst({ url: api.loadArticle, params: params, showLoading: false })
}
//搜索
export const ReqSearch = (params) => {
  return Requst({ url: api.search, params })
}
//获取文章详细
export const ReqGetArticleDetail = (articleId) =>{
  return Requst({ url: api.ArticleDetail, params: { articleId } })
}
//点赞文章
export const ReqDoLike = (articleId) => {
  return Requst({ url: api.doLike, params: { articleId: articleId } })
}
//获取用户积分
export const RequserIntergal = (fileId) => {
  return Requst({ url: api.userIntergal, params: { fileId: fileId } })
}