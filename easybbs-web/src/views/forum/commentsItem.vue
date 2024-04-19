<!-- 单个文章评论 -->
<template>
  <div class="commentItem">
    <!-- 头像 -->
    <userInfoVue :userId="commentDate.userId" :width="50" />
    <div class="comment-info">
      <!-- 昵称  -->
      <div class="nick-name">
        <span @click="goToUserHome(commentDate.userId)">
          {{ commentDate.nickName }}
        </span>
        <span v-if="commentDate.userId == articleUserId" class="author"
          >作者</span
        >
      </div>
      <!-- 评论内容 -->
      <div class="content">
        <div>
          <span class="tag tag-top" v-if="commentDate.topType===1">置顶</span>
        <span class="tag shenhe" v-if="commentDate.status===0">待审核</span>
          <span v-html="commentDate.content"></span>
        </div>
        <!-- 图片评论 -->
        <commentImageVue
        v-if="commentDate.imgPath"
        :src="proxy.globalInfo.imageUrl+commentDate.imgPath.replace('.','_.')"
        :imgList="[proxy.globalInfo.imageUrl+commentDate.imgPath]"
        :style="{'margin-top':'5px'}"
        />
      </div>

      <!-- 评论附带信息-->
      <div class="op-panel">
        <!-- 时间 -->
        <span class="item">{{ commentDate.postTime }}</span>
        <!-- ip-->
        <span>&nbsp;·&nbsp;{{ commentDate.userIpAddress }}&nbsp;&nbsp;</span>
        <!-- 点赞 -->
        <span @click="goodCountClick(commentDate)"
          :class="['iconfont icon-good',commentDate.likeType===1?'active':'']" 
          >
          {{ commentDate.goodCount > 0 ? commentDate.goodCount : '点赞' }}
        </span>
        <!-- 回复 -->
        <span
          class="iconfont icon-comment"
          @click="showReplyClick(commentDate,0)"
        >
          回复
        </span>
        <!-- 是否我当前作者  可设置置顶或取消 -->
        <el-dropdown v-if="currenUserId == articleUserId">
          <span class="iconfont icon-more"></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="opTop(commentDate)">
                {{ commentDate.topType == 0 ? '设为置顶' : '取消置顶' }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 展示二级评论 -->
      <div class="comment-sub" v-if="commentDate.children">
        <div
          class="item"
          v-for="sub in commentDate.children"
          :key="sub.articleId"
        >
          <!-- 头像 -->
          <userInfoVue :userId="sub.userId" :width="30" />
          <div class="info">
            <!-- 昵称 -->
            <div class="nick-name">
              <span @click="goToUserHome(sub.userId)">{{ sub.nickName }}</span>
              <span v-if="sub.userId == articleUserId" class="author"
                >作者</span
              >
              <span class="reply-name">回复</span>
              <span @click="goToUserHome(sub.replyUserId)" class="userReply">
                @{{ sub.replyNickName }}:
              </span>
              <span class="content" v-html="sub.content"></span>
            </div>
            <div class="op-panel">
              <span class="item"><!-- 时间 -->{{ sub.postTime }}</span>
              <span>&nbsp;·{{ sub.userIpAddress }}&nbsp;</span>
              <span :class="['iconfont icon-good',sub.likeType===1?'active':'']" 
                @click="goodCountClick(sub)">
                {{ sub.goodCount > 0 ? sub.goodCount : '点赞' }}
              </span>
              <span class="iconfont icon-comment"
                @click="showReplyClick(sub,1)"
              > 回复
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 二级评论输入框 -->
      <div class="reply-info" v-if="commentDate.showReply">
        <postCommentVue
          :width="30"
          :userId="currenUserId"
          :showImgIndex="false"
          :pCommentId="commentReqDate.pCommentId"
          :articleId="commentReqDate.articleId"
          :replyUserId="commentReqDate.replyUserId"
          :placeholderInfo="replyUserName"
          @BlurContent="replyBlurContent"
          @postCommentFinish="CommentFinish"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import userInfoVue from '@/components/userInfo.vue';
import postCommentVue from './postComment.vue';
import commentImageVue from './commentImage.vue';
import {reactive,ref,getCurrentInstance} from 'vue';
import { store } from '@/vuex';
import {useRouter} from 'vue-router';
import {ReqDoLike,ReqChangeTopType} from '@/api/comments';
import {showLogin} from '@/utils/showLogin';
const {proxy}=getCurrentInstance()
const router=useRouter()
const _props=defineProps({
  commentDate:{
    type:Object,
    default:{}
  },
  articleUserId:String,
  currenUserId:String
})
const emit=defineEmits(['showReply','reloadDate'])
//回复评论需要携带的数据
const commentReqDate=reactive({
  articleId:_props.commentDate.articleId,//文章ID
  pCommentId:0,//父级评论id 一级评论传0
  content:undefined,//评论内容
  image:undefined,//图片文件流  图片和内容必须选一个
  replyUserId:undefined,//回复他人ID
})
//点击回复时  回显恢复的对象昵称
const replyUserName=ref(undefined)
//点击回复 展示二级输出框
const showReplyClick=(date,type)=>{
  if(!showLogin(store)) return  //是否登录校验
  //缓存内容 实现点击同一个回复进行展开收起
  const params=date.showReply==undefined?false:date.showReply
  emit('showReply')//把所有的回复都收起
  if(type===0){//回复楼主
  _props.commentDate.showReply=!params //点击同一个回复按钮
    //收集数据进行输入框回显 回复时展示回复的对象
  commentReqDate.pCommentId=date.commentId
  }else{//回复楼主评论下的子集 不需要收起
  _props.commentDate.showReply=true
  commentReqDate.pCommentId=date.pCommentId
  }
  commentReqDate.replyUserId=date.userId
  replyUserName.value=`回复@${date.nickName}`
}
//子组件传递的输入框失去焦点 调用父组件方法干掉所有输入框
const replyBlurContent=()=>{
  emit('showReply')//把所有的回复都收起
}
//评论发布成功
const CommentFinish=(resDate)=>{
  _props.commentDate.children=resDate
  emit('showReply')//把所有的回复输入框都收起
}
//点击作者昵称|用户昵称 跳转用户主页
const goToUserHome=(id)=>{
router.push(`/user/${id}`)
}
//点赞按钮
const goodCountClick=async(date)=>{
  if(!showLogin(store)) return  //是否登录校验
  try {
    const res= await ReqDoLike(date.commentId)
    if(res.code==200){
      date.goodCount=res.data.goodCount//更改当前点赞数
      date.likeType=res.data.likeType//更改当前用户是否点赞
    }
  } catch (error) {
    return Promise.reject('点赞错误',error)
  }
}
//是否置顶
const opTop=async(date)=>{
  const res= await ReqChangeTopType(date.commentId,date.topType==1?0:1)
  if(res.code==200){
    //通知父组件进行排序
    emit('reloadDate')
  }2
}
</script>

<style scoped lang="scss">
.commentItem {
  padding: 20px;
  display: flex;
  .comment-info {
    flex: 1;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    .nick-name {
      font-size: 14px;
      color: #61666d;
      margin-top: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
    .author {
      background-color: #ff6699;
      color: #fff;
      font-size: 12px;
      margin-left: 5px;
      border-radius: 4px;
    }
    .content {
      margin-top: 5px;
      font-size: 15px;
      .tag{
        margin-right: 5px;
        font-size: 12px;
        border-radius: 4px;
        padding: 2px;
      }
      .tag-top{
        color: #ff6699;
        border: 1px solid #ff6699;
      }
      .shenhe{
        color: #9499a0;
        border: 1px solid #9499a0;

      }
    }
  }
  .op-panel {
    display: flex;
    font-size: 13px;
    color: #61666d;
    align-items: center;
    .iconfont {
      font-size: 13px;
      margin-right: 15px;
      cursor: pointer;
      color: #9499a0;
    }
    .iconfont::before {
      margin-right: 3px;
    }
    .active{
      color:rgb(64 159 219) ; ;
    }
  }
  .comment-sub {
    margin-top: 10px;
    .item {
      display: flex;
      align-items: center;
      margin: 8px 0px;
      font-size: 14px;
      .info {
        .nick-name {
          margin-left: 6px;
          .reply-name {
            margin: 0px 6px;
          }
          .content {
            font-size: 15px;
          }
          .userReply{
            color:rgb(64 159 219) ;
          }
        }
      }
    }
  }
  .reply-info {
    margin-top: 15px;
  }
}
</style>
