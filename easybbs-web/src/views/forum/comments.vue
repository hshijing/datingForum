<!-- 文章评论 -->
<template>
  <div class="comments">
    <div class="commets-title">
      <span class="title">评论</span>
      <span class="count">{{commentList.list?commentList.list.length:0}}</span>
      <div class="tab">
        <span :class="{active:commentParams.orderType==REBANG}" @click="commentOpt(0)">
          热榜
        </span>
        <span style="color: #ddd">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span :class="{active:commentParams.orderType==ZUIXIN}" @click="commentOpt(1)">
          最新
        </span>
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="form-panel">
      <postCommentVue 
        :userId="userInfoDate.userId" 
        :width="50" 
        :showImgIndex="userInfoDate.userId!=null"
        :pCommentId="0"
        :articleId="articleId"
        @postCommentFinish="postComment"
      />  
    </div>
    <!-- 评论区 -->
    <div class="comments-list">
      <dateListVue 
      :date-source="commentList"
      :_loding="loding"
      @locatDate="CommentListVue"
      :dateListMsg="`快来抢占沙发吧`"
      >
        <template #default="{date}">
          <commentsItemVue 
            :commentDate="date"
            :articleUserId="articleUserId"
            :currenUserId="userInfoDate.userId"
            @showReply="showReplyClick"
            @reloadDate="reloadDate"
            />
        </template>
      </dateListVue>
    </div>
  </div>
</template>

<script setup lang="js">
import postCommentVue from './postComment.vue';
import dateListVue from '@/components/dateList.vue';//分页器列表组件
import commentsItemVue from './commentsItem.vue';
import { store } from '@/vuex';
import {ref,watch,onMounted} from 'vue'
import {ReqGetCommentList} from '@/api/comments';
//父组件传递过来的文章id  用户id
const _props=defineProps({
  articleId:String,
  articleUserId:String,
})
//接收目前登录的用户信息
const userInfoDate=ref({})
/* 评论 */
//接收评论列表信息
const commentList=ref({})
/*评论列表排序 */
const REBANG=ref(0)//热榜
const ZUIXIN=ref(1)//最新
//控制数据未回来的是否打开骨架屏
const loding=ref(undefined)
//获取评论列表需要携带的参数
const commentParams=ref({
  articleId:_props.articleId,//文章id
  pageNo:1, //当前页码
  orderType:REBANG.value//排序类型
})
//获取评论列表
const getCommentList=async(date)=>{
  loding.value=true
  const res= await ReqGetCommentList(date)
  if(res.code==200){
    commentList.value=res.data
  }
  loding.value=false
}
//评论发布成功
const postComment=(resDate)=>{
  commentList.value.list.unshift(resDate)
}
//子组件传递分页的函数 分页点击事件 
const CommentListVue=(index)=>{
  commentParams.value.pageNo=index
  getCommentList(commentParams.value)
}
//子组件传递函数  置顶OR取消
const reloadDate=()=>{
  getCommentList(commentParams.value)
}
//排序按钮 热榜 |最新
const commentOpt=(type)=>{
  //默认热榜
  if(type==REBANG.value){
    commentParams.value.orderType=REBANG.value
  }else{//最新
    commentParams.value.orderType=ZUIXIN.value
  }
  getCommentList(commentParams.value)
}
//回复按钮 点击某个item弹出输入框
const showReplyClick=()=>{
  commentList.value.list.forEach(it=>{
    it.showReply=false//关闭回复框
  })
}
onMounted(() => {
  getCommentList(commentParams.value)
}),
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!=null){
      userInfoDate.value=newVal
    }
  },
  {deep:true,immediate:true}
)
</script>

<style scoped lang="scss">
.comments {
  .commets-title {
    padding: 20px;
    display: flex;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    .title {
      font-size: 20px;
    }
    .count {
      padding: 0 10px;
      font-size: 15px;
    }
    .tab {
      cursor: pointer;
    }
  }
  .form-panel {
  margin-top: 10px;
}
.active{
  color: rgb(62, 158, 218);
}
}
</style>
