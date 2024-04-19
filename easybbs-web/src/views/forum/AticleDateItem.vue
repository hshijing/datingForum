<!-- 文章详情页 -->
<template>
  <div
    class="aticle-date-item"
    :style="{ width: `${proxy.globalInfo.herderWidth}px` }"
    v-if="Object.keys(articleDate).length > 0"
  >
    <!-- 导航栏 -->
    <div class="boadr-info">
      <!-- 一级板块分类 点击需要跳转 -->
      <router-link :to="`/forum/${articleDate.pBoardId}`">
        {{ articleDate.pBoardName }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <!-- 二级板块分类 点击需要跳转 -->
      <span v-if="articleDate.boardId">
        <router-link
          :to="`/forum/${articleDate.pBoardId}/${articleDate.boardId}`"
        >
          <span>{{ articleDate.boardName }}</span>
        </router-link>
        <span class="iconfont icon-right"></span>
      </span>
      <!-- 文章标题 -->
      <span>{{ articleDate.title }}</span>
    </div>
    <!-- 标题 个人信息 内容   -->
    <div class="article-detail">
      <!-- 标题 -->
      <span class="title">
        <span v-if="articleDate.status==0" class="tag no-adim">待审核</span>
        {{ articleDate.title }}
      </span>
      <!-- 信息 -->
      <div class="user-info">
        <!-- 头像 -->
        <userInfoVue
          :userId="articleDate.userId"
          :LEFT="`0px`"
          :TOP="`0px`"
          :width="60"
        />
        <div class="user-info-dateli">
          <!-- 用户昵称 -->
          <router-link :to="`/user/${articleDate.userId}`">
            {{ articleDate.nickName }}
          </router-link>
          <!-- 日期 -->
          <div class="time-info">
            <span class="times">{{ articleDate.postTime }}</span>
            <!-- ip -->
            <span
              >&nbsp;·&nbsp;{{ articleDate.userIpAddress }}&nbsp;&nbsp;</span
            >
            <!-- 浏览量 -->
            <span class="iconfont icon-eye-solid" style="margin-right:5px;"/>
            <span>{{articleDate.readCount==0?'阅读':articleDate.readCount}}</span>
            <!-- 编辑 -->
            <router-link :to="`/editPost/${articleDate.articleId}`"
              v-if="userInfo&&articleDate.userId==userInfo.userId"
            >
              <span class="iconfont icon-edit" style="margin-left: 20px;">编辑</span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 文章内容 -->
      <div class="detail" id="detail" v-html="articleDate.content"></div>
    </div>
    <!-- 目录 -->
    <div class="toc-panel">
      <div class="content">
        <AticledirectoryVue :tocArray="directory" />
      </div>
    </div>
    <!-- 文章附件 -->
    <div class="attachment" id="attachment" v-if="attachment">
      <div class="title">附件</div>
      <div class="attachment-info">
        <span class="iconfont icon-zip"><!-- 图标 --></span>
        <!-- 附件昵称 -->
        <span class="file-name">{{ attachment.fileName }}</span>
        <!-- 文件大小 kb-->
        <span class="file-size">&nbsp;&nbsp;{{ fileSize }}&nbsp;&nbsp;</span>
        <!-- 积分 -->
        <span
          >需要&nbsp;<span class="jiFen">{{ attachment.integral }}</span
          >&nbsp;积分</span
        >
        <!-- 下载次数 -->
        <span
          >&nbsp;&nbsp;已下载&nbsp;<span class="downloadCount">
            {{ attachment.downloadCount }}</span
          >&nbsp;次
        </span>
        <!-- 下载按钮 -->
        <el-button
          type="primary"
          size="small"
          class="buttnn"
          @click="downloadFile"
          >下载
        </el-button>
      </div>
    </div>
    <!-- 文章评论 -->
    <div class="comment" id="comment" v-if="showComment&&articleDate.status==1">
      <commentsVue
        v-if="articleDate.articleId"
        :article-id="articleDate.articleId"
        :articleUserId="articleDate.userId"
      />
    </div>
  </div>
  <!-- 左侧快捷操作 -->
  <div class="quick-pannel" :style="{ left: quickPannel + 'px' }">
    <!-- 点赞小图标 -->
    <el-badge
      type="info"
      :hidden="!articleDate.goodCount > 0"
      :value="articleDate.goodCount"
    >
      <div class="quick-item" @click="doLikeClick">
        <!-- 是否点赞区分 根据后端返回数据 -->
        <span
          :class="['iconfont icon-good', haveLike ? 'haveLike' : '']"
        ></span>
      </div>
    </el-badge>
    <!-- 评论小图标 -->
    <el-badge
      type="info"
      v-if="showComment"
      :hidden="!articleDate.commentCount > 0"
      :value="articleDate.commentCount"
    >
      <div class="quick-item" v-if="showComment">
        <span
          class="iconfont icon-comment"
          @click="goToPostionClick('comment')"
        ></span>
      </div>
    </el-badge>
    <!-- 附件连接 -->
    <div
      class="quick-item"
      v-if="attachment"
      @click="goToPostionClick('attachment')"
    >
      <span class="iconfont icon-attachment"></span>
    </div>
  </div>
  <!-- 图片预览功能 -->
  <MyImageVue :imageList="articleImgList" ref="MyImageRef" />
</template>

<script setup lang="js">
import { ref, getCurrentInstance, onMounted,nextTick,watch} from 'vue';
import userInfoVue from '@/components/userInfo.vue';//头像组件
import commentsVue from './comments.vue';//评论组件
import AticledirectoryVue from './Aticledirectory.vue';//目录组件
import MyImageVue from '@/components/MyImage.vue';//提示信息弹窗
import {confirm} from '@/utils/Confirm';//提示信息弹窗
import {_convertSize} from '@/utils/fileSizeConversion';//附件单位转换
import {showLogin} from '@/utils/showLogin';
import { ElMessage  } from 'element-plus';
import hljs from 'highlight.js';//代码高亮插件
import 'highlight.js/styles/atom-one-light.css'//代码高亮库样式
import {ReqDoLike,ReqGetArticleDetail,RequserIntergal}from '@/api/artcle';//api
import {useRoute} from 'vue-router'
import { store } from '@/vuex';
const route=useRoute()
const {proxy}=getCurrentInstance()
//是否显示评论
const showComment=ref(false)
//接收文章详情信息
const articleDate=ref({})
//接收文章附件信息
const attachment=ref({})
//接收目录信息
const directory=ref([])
//用户信息
const userInfo=ref(undefined)
//文章图片列表 用于图片预览
const articleImgList=ref([])
//文章图片组件实例  用于调用子组件方法进行图片预览
const MyImageRef=ref()
//经过单位转化后的文件大小
const fileSize=ref('')
//是否点赞
const haveLike=ref(false)
//点赞按钮
const doLikeClick=async()=>{
  //判断是否登录
  if(!showLogin(store))return
  //点赞状态
  try {
    const res=await ReqDoLike(articleDate.value.articleId)
    if(res.code==200){
      haveLike.value=!haveLike.value
      let goodCont=undefined;
      !haveLike.value?goodCont=-1:goodCont=1;
      //更新点赞数
      articleDate.value.goodCount=articleDate.value.goodCount+goodCont
    }
  } catch (error) {
    return  Promise.reject('请求错误,用户未登录',error)
  }
}
//获取文章信息
const GetArticleDetail=async(articleId)=>{
  try {
    const res= await ReqGetArticleDetail(articleId)
    if(res.code===200){
      articleDate.value=res.data.forumArticle//文章详情信息
      attachment.value=res.data.attachment//文章积分信息
      haveLike.value=res.data.haveLike//是否点赞
      imgPreview() //图片预览
      codeHighlight()//代码高亮
      parseText()//解析目录
      //更新仓库的一级id 用于板块高亮
      store.commit('setAcivePboardId',res.data.forumArticle.pBoardId)
      //更新仓库的二级id 用于板块高亮
      store.commit('setAciveboarId',res.data.forumArticle.boardId)
    }
  } catch (error) {
    return Promise.reject('获取文章详情失败',error)
  }
}
//下载附件
const downloadFile=async()=>{
    //判断是否登录
  if(!showLogin(store))return
  try {
    const res= await RequserIntergal(attachment.value.fileId)
    if(res.code===200){
      flemNointegral(res.data)
    }
  } catch (error) {
    return Promise.reject('下载失败',error)
  }
}
//是否满足下载条件 满足就下载
const flemNointegral=(date)=>{
  const userId=userInfo.userId
  const res=date.userIntegral
  const Isfile=date.haveDownload
  //积分不够 且不是发布者 且未下载过
  if(res<attachment.value.integral&&userId!=articleDate.value.userId&&!Isfile){
    ElMessage.warning('您的积分不够，无法下载')
    return false;
  }
  //用户已下载过文章||文章下载不需要积分||下载者为文章发布者
  if(Isfile||attachment.value.integral==0||userId==articleDate.value.userId){
    fileDate()
    return true;
  }
  //积分足够 弹出下载 确认
  confirm(
    `你还有${res}积分,当前下载需要扣除${attachment.value.integral}积分,
    是否进行下载？`,
    ()=>{
      //下载  返回文件流
      fileDate()
  })
  return true;
}
//进行下载操作
const attrAPI='/api/forum/attachmentDownload'
const fileDate=()=>{
  document.location.href=attrAPI+'?fileId='+attachment.value.fileId
  attachment.value.downloadCount=attachment.value.downloadCount+1
}
//文章图片预览
const imgPreview=()=>{
  //后端接口返回的富文本
  nextTick(()=>{
    //获取富文本中的所有图片节点
    const imgNode=document.querySelector('.detail').querySelectorAll('img')
    const imgList=[]
    imgNode.forEach((el,i)=>{
      //获取所有图片的地址
      const src=el.getAttribute('src')
      imgList.push(src)
      el.addEventListener('click',()=>{
        //调用子组件方法 进行预览 传入下标
        MyImageRef.value.show(i)
      })
    })
    //给子组件传递图片地址
    articleImgList.value=imgList
  })
}
//文章内容代码高亮
const codeHighlight=()=>{
  //与图片一样 接口返回富文本 获取节点完事
  nextTick(()=>{
    //获取所有由<code>包裹的代码节点
    let blooks=document.querySelectorAll('pre code')
    blooks.forEach(it=>{
      //高亮使用js库
      hljs.highlightBlock(it)
    })
  })
}
//解析文本目录
const parseText=()=>{
  nextTick(()=>{
    //获取目录节点
    const dom=document.querySelector('#detail');
    const childrendom=dom.querySelectorAll('h1,h2,h3,h4,h5,h6')
    childrendom.forEach((el,i)=>{
      if(el.textContent==='') return
      const id='toc'+i; //给每个节点添加下标id
      el.setAttribute('id',id)//给每个节点添加锚点
      directory.value.push({
        id,//锚点id
        title:el.textContent,//标题文本
        level:Number.parseInt(el.tagName.slice(1)),//标题等级
        offsetTop:el.offsetTop//标题距离页面顶部的距离
      })
    })
  })
}
//快捷操作的位置计算
const quickPannel=(window.innerWidth-proxy.globalInfo.herderWidth)/2-120
//点击评论|附件小图标  视口滚动到对应位置
const goToPostionClick=(elementId)=>{
  document.querySelector(`#${elementId}`).scrollIntoView(true)
}
onMounted(()=>{
  GetArticleDetail(route.params.acticleId)
})
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!=null){
      userInfo.value=newVal
    }
  },
  {immediate:true,deep:true}
)
watch(
  ()=>store.state.commentOpen,
  (newVal)=>{
    if(newVal){
      showComment.value=newVal
    }
  },
  {immediate:true,deep:true}
)
</script>

<style  lang="scss">
.aticle-date-item {
  position: relative;
  margin: 0 auto;
  /* 标签栏面包屑 */
  .boadr-info {
    width: 100%;
    height: 20px;
    padding: 10px 0px;
    .icon-right {
      color: #080808;
      margin: 0 5px;
    }
    a {
      text-decoration: none;
      color: #409eff;
    }
  }
  /* 头像信息 */
  .article-detail {
    padding: 5px 15px;
    width: 1000px;
    background-color: #fff;
    .title {
      font-size: 16px;
      font-weight: 700;
      .tag{
          font-size: 12px;
          border-radius: 3px;
          padding: 0px 5px;
          margin-right: 5px;
          font-weight: normal;
        }
        .no-adim{
            color: #a4a4a4;
            border: 1px solid #a4a4a4;
          }
    }
    .user-info {
      margin-top: 15px;
      display: flex;
      border-bottom: 1px solid #ddd;
      align-items: center;
      padding: 0 0 15px 0;
      .user-info-dateli {
        margin-left: 16px;
        a {
          text-decoration: none;
          color: #4e5969;
        }
        .time-info {
          margin-top: 10px;
          font-size: 14px;
          color: #848383;
        }
      }
    }
    .detail {
      letter-spacing: 3px;
      line-height: 21px;
      a {
        color: #4b4b4c;
        text-decoration: none;
      }
      p{
        max-width: 1000px !important;
        img{
          width: 100%;
        }
      }
    }
  }
  /* 文章内容 */

  /* 文件附件 */
  .attachment {
    width: 1000px;
    background-color: #fff;
    margin-top: 20px;
    .title {
      padding: 20px 0 0 20px;
      font-size: 20px;
      color: #848383;
    }
    .attachment-info {
      display: flex;
      align-items: center;
      color: #848383;
      padding: 0 0 20px 20px;

      .icon-zip {
        color: #b9cf11;
      }
      .file-name {
        font-size: 20px;
        color: #b9cf11;
      }
      .jiFen,
      .downloadCount {
        color: #bd2f0c;
      }
      .buttnn {
        position: relative;
        left: 20px;
      }
    }
  }
  /* 评论 */
  .comment {
    margin-top: 30px;
    width: 1000px;
    background-color: #fff;
  }
}
.toc-panel {
  position: absolute;
  top: 40px;
  right: -30px;
  width: 285px;
  .content {
    background-color: rgb(255, 255, 255);
    width: 285px;
    position: fixed;
  }
}
/* 左侧快捷操作 */
.quick-pannel {
  position: absolute;
  width: 50px;
  top: 150px;
  text-align: center;
  :deep(.el-badge__content.is-fixed) {
    top: 5px;
    right: 15px;
    width: 12px;
  }
  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #fff;
    margin-bottom: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 25px;
      color: #697484;
    }
    .haveLike {
      color: red;
    }
  }
}
</style>
