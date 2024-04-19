<template>
  <div class="message" :style="{ width: `${proxy.globalInfo.herderWidth}px` }">
    <!-- 导航栏 -->
    <div class="bannel">
      <router-link to="/">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <!-- 内容 -->
    <div class="pannel">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange">
        <!-- 系统信息 -->
        <el-tab-pane name="sys">
          <template #label>
            <div class="tag-item">
              <span>系统信息</span>
              <span class="cont-tag" v-if="messageContInfo.sys > 0">
                {{ messageContInfo.sys > 99 ? '99+' : messageContInfo.sys }}
              </span>
            </div>
          </template>
        </el-tab-pane>
        <!-- 回复我的 -->
        <el-tab-pane name="reply">
          <template #label>
            <div class="tag-item">
              <span>回复我的</span>
              <span class="cont-tag" v-if="messageContInfo.reply > 0">
                {{ messageContInfo.reply > 99 ? '99+' : messageContInfo.reply }}
              </span>
            </div>
          </template>
        </el-tab-pane>
        <!-- 赞了我的文章 -->
        <el-tab-pane name="likePost">
          <template #label>
            <div class="tag-item">
              <span>赞了我的文章</span>
              <span class="cont-tag" v-if="messageContInfo.likePost > 0">
                {{
                  messageContInfo.likePost > 99
                    ? '99+'
                    : messageContInfo.likePost
                }}
              </span>
            </div>
          </template>
        </el-tab-pane>
        <!-- 赞了我的评论 -->
        <el-tab-pane name="likeComment">
          <template #label>
            <div class="tag-item">
              <span>赞了我的评论</span>
              <span class="cont-tag" v-if="messageContInfo.likeComment > 0">
                {{
                  messageContInfo.likeComment > 99
                    ? '99+'
                    : messageContInfo.likeComment
                }}
              </span>
            </div>
          </template>
        </el-tab-pane>
        <!-- 下载了我的附件 -->
        <el-tab-pane name="downloadAttachment">
          <template #label>
            <div class="tag-item">
              <span>下载了我的附件</span>
              <span
                class="cont-tag"
                v-if="messageContInfo.downloadAttachment > 0"
              >
                {{
                  messageContInfo.downloadAttachment > 99
                    ? '99+'
                    : messageContInfo.downloadAttachment
                }}
              </span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="list">
        <dateListVue
          :dateSource="messageList"
          :_loding="loding"
          @locatDate="locatDateChange"
          :dateListMsg="`暂无消息`"
        >
          <template #default="{ date }">
            <!-- 系统消息 -->
            <div class="message-item" v-if="date.messageType == 0">
              <div class="content">
                <span v-html="date.messageContent"></span>
                <span class="time">{{ date.createTime }}</span>
              </div>
            </div>
            <!-- 回复我的 -->
            <div class="message-item" v-if="date.messageType == 1">
              <userInfoVue :user-id="date.sendUserId" :width="50" />
              <div class="content">
                <router-link :to="`/user/${date.sendUserId}`">
                  @{{ date.sendNickName }}
                </router-link>
                对我的文章【
                <router-link :to="`/post/${date.articleId}`">
                  @{{ date.articleTitle }} 
                  </router-link>】发表了评论
                <span class="time">{{ date.createTime }}</span>
                <div class="reply" v-html="date.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的评论 -->
            <div class="message-item" v-if="date.messageType == 3">
              <userInfoVue :user-id="date.sendUserId" :width="50" />
              <div class="content">
                <router-link :to="`/user/${date.sendUserId}`">
                  @{{ date.sendNickName }}
                </router-link>
                在文章【
                <router-link :to="`/post/${date.articleId}`">
                  @{{ date.articleTitle }} 
                  </router-link>】赞了我的评论
                <span class="time">{{ date.createTime }}</span>
                <div class="reply" v-html="date.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的文章 -->
            <div class="message-item" v-if="date.messageType == 2">
              <userInfoVue :user-id="date.sendUserId" :width="50" />
              <div class="content">
                <router-link :to="`/user/${date.sendUserId}`">
                  @{{ date.sendNickName }}
                </router-link>
                赞了我的文章【
                <router-link :to="`/post/${date.articleId}`">
                  @{{ date.articleTitle }} 
                  </router-link>】
                <span class="time">{{ date.createTime }}</span>
                <div class="reply" v-html="date.messageContent"></div>
              </div>
            </div>
            <!-- 下载了我的附件 -->
            <div class="message-item" v-if="date.messageType == 4">
              <userInfoVue :user-id="date.sendUserId" :width="50" />
              <div class="content">
                <router-link :to="`/user/${date.sendUserId}`">
                  @{{ date.sendNickName }}
                </router-link>
                在文章【
                <router-link :to="`/post/${date.articleId}`">
                  @{{ date.articleTitle }} 
                  </router-link>】中下载了附件
                <span class="time">{{ date.createTime }}</span>
              </div>
            </div>
          </template>
        </dateListVue>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import dateListVue from '@/components/dateList.vue';
import userInfoVue from '@/components/userInfo.vue';
import {getCurrentInstance,ref,watch} from 'vue';
import {ReqloadMessageList} from '@/api/usernter';
import {useStore} from 'vuex';
import {useRouter,useRoute} from 'vue-router';
const store=useStore()
const router=useRouter()
const route=useRoute()
const {proxy} = getCurrentInstance();
const messageList=ref({})//接收信息内容列表
const loding=ref(false)//骨架屏
const pageNo=ref(1)//当前页码
const activeName = ref('reply');//标签栏选择绑定
//获取消息列表
const loadMessageList=async()=>{
  loding.value=true
  let params={
    code:activeName.value,
    pageNo:pageNo.value,
  }
  const res=await ReqloadMessageList(params)
  loding.value=false
  if(res.code===200){
    console.log(res)
    messageList.value=res.data
    store.commit('readMessage',activeName.value)
  }
}
//消息数量
const messageContInfo=ref({})
//分页器变化触发
const locatDateChange=(page)=>{
  pageNo.value=page
  loadMessageList()
}
//标签栏变化触发
const tabChange=(type)=>{
  router.push(`/message/${type}`)
}
//监听路由变化 请求消息列表
watch(
  ()=>route.params.type,
  (newVal)=>{
    if(newVal){
      activeName.value=newVal
      loadMessageList()
    }
  },
  {immediate:true,deep:true}
  )
watch(
  ()=>store.state.messageCont,
  (newVal)=>{
    messageContInfo.value=newVal
  },
  {immediate:true,deep:true}
  )
</script>

<style scoped lang="scss">
.message {
  margin: 0 auto;
  padding: 10px;
  .bannel {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #7f7f85;
    .icon-right {
      padding: 0px 5px;
      color: #555666;
    }
    a {
      text-decoration: none;
      color: #409eff;
    }
  }
  .pannel {
    background: #fff;
    padding: 10px 20px;
    margin-top: 20px;
    .tag-item {
      position: relative;
      .cont-tag {
        position: absolute;
        width: 20px;
        height: 20px;
        right: -20px;
        top: -10px;
        display: block;
        background-color: #f56c6c;
        border-radius: 50%;
        font-size: 15px;
        text-align: center;
        line-height: 20px;
        color: #fff;
      }
    }
    .list {
      .message-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        border-bottom: 1px solid #d7d5d5;
        padding: 10px;
        .content {
          margin-left: 10px;
          a {
            text-decoration: none;
            color: #409eff;
          }
          .time {
            color: #7f7f85;
            margin-left: 15px;
          }
        }
        .reply {
          border-left: 2px solid #198eb8;
          padding-left: 5px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
