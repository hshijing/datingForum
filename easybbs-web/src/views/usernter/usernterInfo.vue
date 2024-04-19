<!-- 用户中心  -->
<template>
  <!-- 用户信息 -->
  <div class="avatr">
    <span class="edit-btn" 
      v-if="currId&&currId===userId"
      @click="goToshowEdit"
    >
      修改资料
    </span>
    <editUserInfoVue ref="editUserInfoRef" @flushedUserInfo="flushedHandler"/>
    <!-- 头像 -->
    <div class="inner">
      <userInfoVue :userId="userInfoDate.userId" :width="120" />
    </div>
    <!-- 个人信息 -->
    <div class="nick-name">
      <span>{{ userInfoDate.nickName }}</span>
      <!-- 女 icon -->
      <span
        v-if="userInfoDate.sex == 0"
        class="iconfont icon-woman"
        :style="{ color: '#d348a0' }"
      />
      <!-- 男 icon -->
      <span
        v-if="userInfoDate.sex == 1"
        class="iconfont icon-man"
        :style="{ color: '#4892d3' }"
      />
    </div>
    <!-- 个人小简介 -->
    <div class="desc">{{ userInfoDate.personDescription }}</div>
  </div>
  <!-- 扩展信息 -->
  <div class="extend">
    <!-- 积分 -->
    <div class="info-item">
      <div class="lebal iconfont icon-integral">积分</div>
      <div 
        v-if="currId&&currId===userId"
        class="value"
        @click="GetrecordInfoHandel"
        :style="{ color: '#4892d3', cursor: 'pointer'}"
      >
        {{ userInfoDate.currentIntegral }}
      </div>
      <div class="value" v-else>{{ userInfoDate.currentIntegral}}</div>
    </div>
    <!--自己积分使用列表的显示 -->
      <userIntegralVue
        ref="userIntegralRef"
      />
    <!-- 获赞 -->
    <div class="info-item">
      <div class="lebal iconfont icon-like">获赞</div>
      <div class="value">{{ userInfoDate.likeCount }}</div>
    </div>
    <!-- 发帖 -->
    <div class="info-item">
      <div class="lebal iconfont icon-post">发帖</div>
      <div class="value">{{ userInfoDate.postCount }}</div>
    </div>
    <!-- 加入时间 -->
    <div class="info-item">
      <div class="lebal iconfont icon-register">加入时间</div>
      <div class="value">{{ userInfoDate.joinTime }}</div>
    </div>
    <!-- 最后登录 -->
    <div class="info-item">
      <div class="lebal iconfont icon-login">最后登录</div>
      <div class="value">{{ userInfoDate.lastLoginTime }}</div>
    </div>
  </div>
</template>

<script setup lang="js">
import userInfoVue from '@/components/userInfo.vue';
import editUserInfoVue from './editUserInfo.vue';
import userIntegralVue from './userIntegral.vue';
import {ReqgetUserInfo} from '@/api/usernter';
import {useRoute} from 'vue-router';
import {ref,onMounted,watch} from 'vue';
import { store } from '@/vuex';
const route = useRoute();
//跳转的用户id
const userId=ref(undefined)
//当前登录的用户id
const currId=ref(undefined)
//接收跳转的用户信息
const userInfoDate=ref({})
//子组件实例 控制编辑用户信息弹窗
const editUserInfoRef=ref()
//子组件实例 控制积分列表弹窗
const userIntegralRef=ref()
//获取用户信息
const getuserInfoDate=async()=>{
  const res=await ReqgetUserInfo(userId.value);
  if(res.code===200){
    userInfoDate.value=res.data;
  }
}
//修改资料按钮
const goToshowEdit=()=>{
  editUserInfoRef.value.showEditDilong(true,userInfoDate.value);
}
//修改成功后更新数据
const flushedHandler=(date)=>userInfoDate.value=date
//点击获取积分列表
const GetrecordInfoHandel=()=>{
  userIntegralRef.value.GetrecordInfo(userInfoDate.value);
}

//获取用户id  请求服务器
onMounted(()=>{
  userId.value=route.params.userId;
  getuserInfoDate()
})

//监听登录用户
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!=undefined&&Object.keys(newVal).length!==0){
      currId.value=newVal.userId;
    }
  },
  {deep:true,immediate:true}
)
watch(
  ()=>route.params.userId,
  (newVal,oldVal)=>{
    if(newVal!=null&&newVal!=oldVal){
      userId.value=route.params.userId;
      getuserInfoDate()
    }
  }
)
</script>

<style scoped lang="scss">
.avatr {
  background: #fff;
  text-align: center;
  padding: 10px;
  .inner {
    display: flex;
    justify-content: center;
  }
  .edit-btn {
    margin-right: -200px;
    font-size: 14px;
    color: #4892d3;
    cursor: pointer;
  }
  .nick-name {
    .iconfont {
      margin-left: 5px;
    }
  }
  .desc {
    font-size: 14px;
    color: #555666;
    padding: 5px;
    text-align: left;
  }
}
.extend {
  margin-top: 10px;
  background: #fff;
  padding: 10px;
  .info-item {
    display: flex;
    justify-content: space-between;
    .lebal {
      font-size: 13px;
      line-height: 30px;
    }
    .lebal::before {
      font-size: 20px;
      color: #abb1c2;
      padding-right: 5px;
    }
    .value{
      font-size: 13px;
      line-height: 30px;
      text-align: center;
    }
  }
}
</style>
