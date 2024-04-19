import Requst from '@/utils/Requst'
import router from '@/router/index';
const api = {
  getUserInfo: '/ucenter/getUserInfo', //获取用户信息
  loadUserIntegralRecord: '/ucenter/loadUserIntegralRecord', //积分记录
  updateUserInfo: '/ucenter/updateUserInfo', //修改个人信息
  loadUserArticle: '/ucenter/loadUserArticle', //获取用户发帖
  getMessageCount: '/ucenter/getMessageCount', //获取用户消息数
  loadMessageList: '/ucenter/loadMessageList', //获取消息列表
}
//获取用户信息
export const ReqgetUserInfo=(userId)=>{
  return Requst(
    {
      url: api.getUserInfo, 
      params: { userId },
      errorCallback:()=>{
        console.log('获取用户信息失败')
        setTimeout(() => {
          router.push('/')
        }, 1*1000);
      }
    }
  )
}
//积分记录
export const ReqloadUserIntegralRecord = (params) => {
  return Requst({ url: api.loadUserIntegralRecord, params })
}
//修改个人信息
export const RequpdateUserInfo = (params) => {
  return Requst({ url: api.updateUserInfo, params})
}
//获取用户发帖
export const ReqloadUserArticle = 
(type,userId, pageNo) => {
  return Requst(
    {
      url: api.loadUserArticle,
      params: { userId, type, pageNo } ,
      showLoading:false,
    })
}
//获取用户消息数
export const ReqgetMessageCount = () => {
  return Requst({ url: api.getMessageCount})
}
//获取消息列表
export const ReqloadMessageList = (params) => {
  return Requst({ url: api.loadMessageList, params})
}




          /* <!-- 消息与头像 -->
<template>
  <!-- 消息列表 -->
  <div class="message">
    <el-dropdown>
      <el-badge
        :value="messageCont.total"
        :hidden="messageCont.total === 0 || messageCont.total === null"
      >
        <div class="iconfont icon-message"></div>
      </el-badge>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goToMessage('sys')" class="item">
            <span class="text">系统信息</span>
            <span class="cunt-tag" v-if="messageCont.sys > 0">
              {{ messageCont.sys > 99 ? '99+' : messageCont.sys }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click="goToMessage('reply')" class="item">
            <span class="text">回复我的</span>
            <span class="cunt-tag" v-if="messageCont.reply > 0">
              {{ messageCont.reply > 99 ? '99+' : messageCont.reply }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click="goToMessage('likePost')" class="item">
            <span class="text">赞了我的文章</span>
            <span class="cunt-tag" v-if="messageCont.likePost > 0">
              {{ messageCont.likePost > 99 ? '99+' : messageCont.likePost }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click="goToMessage('likeComment')" class="item">
            <span class="text">赞了我的评论</span>
            <span class="cunt-tag" v-if="messageCont.likeComment > 0">
              {{
                messageCont.likeComment > 99 ? '99+' : messageCont.likeComment
              }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click="goToMessage('downloadAttachment')" class="item">
            <span class="text">下载了我的附件</span>
            <span class="cunt-tag" v-if="messageCont.downloadAttachment > 0">
              {{
                messageCont.downloadAttachment > 99
                  ? '99+'
                  : messageCont.downloadAttachment
              }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <!-- 用户头像 -->
  <div class="userInfo">
    <el-dropdown>
      <userInfoCmp
        :userId="props.userId"
        :LEFT="`100px`"
        :TOP="`-15px`"
        :addLink="false"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goToMyUserInfo">
            我的主页
          </el-dropdown-item>
          <el-dropdown-item @click="logout"> 退出登录 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="js">
import { store } from '@/vuex';
import userInfoCmp from './userInfo.vue';
import {ReqLogout} from '@/api/user';
import {ReqgetMessageCount} from '@/api/usernter';
import {confirm} from '@/utils/Confirm';
import {useRouter} from 'vue-router';
import {ref,watch} from 'vue';
const router=useRouter()
const props=defineProps({
  userId:String
})
//消息总数
const messageCont=ref({})
//获取用户消息
const getMessageCont=async()=>{
  const res=await ReqgetMessageCount()
  if(!res) return
  messageCont.value=res.data
  store.commit('updateMessageCont',res.data)
}
//前往个人主页
const goToMyUserInfo=()=>{
  router.push(`/user/${props.userId}`)
}
//跳转信息页面
const goToMessage=(type)=>{
  router.push(`/user/message/${type}`)
}
//退出
const logout=async()=>{
  confirm('确定要退出吗？',async()=>{
    const res=await ReqLogout()
    if(res.code===200){
      store.commit('removeLoginInfo',undefined)
      router.go(0)
    }
  })
}
watch(
  ()=>store.state.messageCont,
  (newVal)=>{
    messageCont.value=newVal
  },
  {immediate:true,deep:true}
  )
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!==null&&newVal!==undefined){
      getMessageCont()
    }
  },
  {deep:true,immediate:true}
)
</script>

<style scoped lang="scss">
.message {
  position: relative;
  margin-left: 20px;
  top: 25px;
  cursor: pointer;
  .icon-message {
    font-size: 25px;
    cursor: pointer;
    color: #555666;
  }
  .message-dropdown {
    width: 200px;
  }
}
.item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .cunt-tag {
    width: 15px;
    height: 15px;
    display: block;
    background-color: #f56c6c;
    border-radius: 50%;
    font-size: 12px;
    text-align: center;
    line-height: 15px;
    color: #fff;
  }
}
.el-dropdown-menu {
  width: 150px;
}
</style>
 */