/* 发布相关*/
const api = {
  uploadImage: '/file/uploadImage', //图片上传
  loadBoard4Post: '/forum/loadBoard4Post', //获取板块信息
  postArticle: '/forum/postArticle', //发布文章
  articleDetail4Update: '/forum/articleDetail4Update', //修改文章获取详情
  updateArticle: '/forum/updateArticle', //修改文章
  search: '/forum/search', //搜索文章
}
import Requst from '@/utils/Requst'
import { ElMessageBox } from 'element-plus'
import router from '@/router/index';
//图片上传
export const RequploadImage = (file) => {
  return Requst({ url: api.uploadImage, params: { file } })
}
//获取板块
export const ReqloadBoard4Post = () => {
  return Requst({ url: api.loadBoard4Post })
}

//发布文章|修改文章  根据 id区分
export const ReqArticle = (params) => {
  if (!params.articleId){ //新增文章
    return Requst({ url: api.postArticle, params })
  }else{//修改文章
    return Requst({ url: api.updateArticle, params })
  }
}

//修改文章获取详情
export const ReqarticleDetail4Update = (articleId) => {
  return Requst({
    url: api.articleDetail4Update,
    params: { articleId },
    showError: false,
    errorCallback: (res) => {
      ElMessageBox.alert(res.data.info, '错误', {
        showClose:false,
        callback: (action) => {
          router.go(-1)
        },
      })
    },
  })
}
//搜索文章
export const Reqsearch = (keyword) => {
  return Requst({ url: api.search, params: { keyword } })
}
