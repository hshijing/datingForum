<!-- 消息与头像 -->
<template>
  <div class="mes-user">
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
            <template v-for="item in messageList" :key="item.id">
              <el-dropdown-item @click="goToMessage(item.id)" class="item">
                <span class="text">{{ item.name }}</span>
                <span class="cunt-tag" v-if="item.value > 0">
                  {{ item.value > 99 ? '99+' : item.value }}
                </span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 用户头像 -->
    <div class="userInfo">
      <el-dropdown>
        <userInfoCmp
          :userId="props.userId"
          :LEFT="`80px`"
          :TOP="`-35px`"
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
  </div>
</template>

<script setup lang="js">
import { store } from '@/vuex';
import userInfoCmp from './userInfo.vue';
import {ReqLogout} from '@/api/user';
import {ReqgetMessageCount} from '@/api/usernter';
import {confirm} from '@/utils/Confirm';
import {useRouter,useRoute} from 'vue-router';
import {ref,watch} from 'vue';
const router=useRouter()
const route=useRoute()
const props=defineProps({
  userId:String
})
//消息总数
const messageCont=ref({})
const messageList=ref([])
const userMessage=ref({
  sys:'系统信息',
  reply:'回复我的',
  likePost:'赞了我的文章',
  likeComment:'赞了我的评论',
  downloadAttachment:'下载了我的附件',
})
//获取用户消息
const getMessageCont=async()=>{
  const res=await ReqgetMessageCount()
  if(res.code===200){
    messageCont.value=res.data
    store.commit('updateMessageCont',res.data)
  }
}
//前往个人主页
const goToMyUserInfo=()=>{
  router.push(`/user/${props.userId}`)
}
//跳转信息页面
const goToMessage=(type)=>{
  return router.push(`/message/${type}`)
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
//用户查看消息  更新页面消息数
watch(
  ()=>store.state.messageCont,
  (newVal)=>{
    messageCont.value=newVal 
    //消息处理 减少html的书写
    const arr1=Object.keys(newVal)
    .map((item,index)=>{
      if(index>0){
        return{
          name:userMessage.value[item],
          id:item,
          value:messageCont.value[item]
        }
      }
    })
    messageList.value=arr1.filter(item=>item!=undefined)
  },
  {immediate:true,deep:true}
  )
//用户登录获取消息
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!==null&&newVal!==undefined){
      getMessageCont()
    }
  },
  {deep:true,immediate:true}
)
//路由变化获取消息
watch(
  ()=>route.path,
  ()=>{
    getMessageCont()
  }
)
</script>

<style scoped lang="scss">
.mes-user {
  position: relative;
  margin-left: 20px;
  top: 25px;
  cursor: pointer;
  .message {
  .icon-message {
    font-size: 25px;
    color: #6c6d77;
  }
  .message-dropdown {
    width: 200px;
  }
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
    max-width: 20px;
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
