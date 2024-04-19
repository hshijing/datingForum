<template>
  <!-- 导航栏 -->
  <div class="herder" v-show="layoutScollY" ref="herder">
    <!-- 导航栏主体 -->
    <div class="herder-content"
      :style="{ width: `${proxy.globalInfo.herderWidth}px` }"
    >
      <!-- 网站首页图标 ->点击返回首页 -->
      <router-link class="logo" to="/">
        <img src="../assets/img1702213725513.png" alt="首页" />
      </router-link>
      <!-- 板块分类信息 -->
      <div class="menu-panel">
        <plateVue/>
      </div>
      <!-- 登录 注册 用户信息 -->
      <div class="user-panel">
        <!-- 发布 -->
        <el-button type="primary" @click="newPostClick">发帖
          <span class="iconfont icon-add"></span>
        </el-button>
        <!-- 搜索 -->
          <searchVue/>
        <!-- 登录按钮 | 个人信息 -->
        <div class="loginOruserInfo">
          <template v-if="!userInfo.userId">
            <!-- 登录按钮 -->
            <button  class="button-login" @click="loginOrReg">
            <div class="svg-wrapper-1">
              <div class="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span class="span-login">login</span>
          </button>
          </template>
          <!-- 个人信息 -->
          <template v-else >
            <herderMessage :userId="userInfo.userId"/>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- 主体内容 -->
  <div class="body-content">
    <router-view></router-view>
  </div>
  <!-- 底部 -->
  <div class="footer">
    <footerVue/>
  </div>
  <!-- 登录|注册组件  -->
  <loginVue ref="loginOrRegisterRef" />
</template>
<script setup lang="js">
import loginVue from './login.vue';
import herderMessage from '@/components/herderMessage.vue';
import plateVue from '@/components/plate.vue';
import searchVue from '@/views/search/seach.vue';
import footerVue from './footer.vue';
import {ref,getCurrentInstance,onMounted,watch} from "vue"
import {_throttle} from '@/utils/throttle.js';//节流
import {showLogin} from '@/utils/showLogin.js';
import { useStore } from 'vuex';
import {useRouter} from 'vue-router';
import { ReqGetUserInfo,ReqGetSysSetting } from '@/api/user.js';
//全局this->获取一些全局的变量
const {proxy}=getCurrentInstance()
const store=useStore()
const router=useRouter()
let layoutScollY = ref(true); // 导航栏是否隐藏
const loginOrRegisterRef=ref()//登录组件实例
let userInfo=ref({})//存储用户登录信息
const boardLIst=ref([])//收集页面板块分类信息
// 获取滚动条当前位置
const getScollY = () => {
  return document.documentElement.scrollTop || document.body.scrollTop;
};
// 监听滚动条位置
const initScoll = () => {
  // 初始位置
  let initScollTop = getScollY();
  // 记录当前滚动行为  0->往上  1->往下
  let scrollType = 0;
  const scollHander=()=>{
    let currentScollTop = getScollY();
    // 往下滚动|往上滚动
    currentScollTop > initScollTop ? scrollType = 1 : scrollType = 0;
    // 更新当前滚动条位置
    initScollTop = currentScollTop;
    // 进行显示隐藏操作
    layoutScollY.value = !(scrollType === 1 && currentScollTop > 120);
  }
  const throttledScrollHandler = _throttle(() => {
  //使用requestAnimationFrame来确保在每次浏览器准备渲染新帧前执行事件处理函数
  requestAnimationFrame(scollHander);
}, 300);
  window.addEventListener('scroll', throttledScrollHandler)
};
onMounted(() => {
  //挂载监听滚动条
  initScoll()
  //获取用户信息 ->后端设计退出登录就返回null 其他情况通通返回信息
  getUserInfo()
  //获取板块信息 ->不需要登录就有 所以请求一次直接存本地
  getCategoryInfo()
  getSystemSetting()//获取系统设置信息
});
//发布按钮
const newPostClick=()=>{
  const showlogi=showLogin(store)
  //登录校验
  if(showlogi){
    //跳转发布页面
    router.push('/newpost')
  }
}
//获取用户头像
const getUserInfo=async()=>{
  const res=await ReqGetUserInfo()
  if(res&&res.code===200){
    //调用仓库存储数据
    store.commit('updateLoginInfo',res.data)
  }
}
//点击登录->调用子组件方法进行登录操作
const loginOrReg=()=>loginOrRegisterRef.value.showPanel()
//获取页面的板块分类信息
const getCategoryInfo=async()=>{
  //如果本地存储有值 说明已经获取过了 直接拿本地的 减少请求次数
  //本地存储没有值 说明第一次请求 调用仓库请求 仓库内部把数据存储到本地
  const date=JSON.parse(localStorage.getItem('PlateListInfo'))
  date?null:await store.dispatch('getPlateList')
  /* 为什么不使用date？
    因为第一次的时候本地存储是没有值的 进行仓库操作本地存储才有值
    而date保存的是前一次本地存储的值 而本地没有值 则会从新运行一次函数
  */
  boardLIst.value=JSON.parse(localStorage.getItem('PlateListInfo'))
}
//获取系统设置
const getSystemSetting=async()=>{
  const res=await ReqGetSysSetting()
  if(res.code===200){
    store.commit('updateCommentOpen',res.data.commentOpen)
  }
}
// 监听->登录用户信息
watch(()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!=null&&Object.keys(newVal).length!==0){
      userInfo.value=newVal
    }else{
      userInfo.value={}
    }
  },
  {deep:true,immediate:true}
  )
//监听->是否展示弹出登录框
watch(()=>store.state.showLogin,
  (newVal)=>newVal?loginOrRegisterRef.value.showPanel():null,
  {deep:true,immediate:true}
)
</script>

<style scoped lang="scss">
.herder {
  position: fixed;
  width: 100%;
  height: 55px;
  top: 0px;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  .herder-content {
    align-items: center;
    margin: 0 auto;
    height: 55px;
    display: flex;
    .logo {
      position: relative;
      top: -12px;
      left: -30px;
      display: block;
      margin-right: 10px;
      width: 350px;
    }
    .menu-panel {
      flex: 1;
      display: flex;
      span{
        font-size: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
    }
    .user-panel {
      width: 500px;
      display: flex;
      align-items: center;
      .loginOruserInfo{
        width: 200px;
      }
      .button-login {
        position: relative;
        left: 100px;
        width: 80px;
        height: 40px;
        font-family: inherit;
        font-size: 20px;
        background: #409eff;
        color: white;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.2s;
        cursor: pointer;
      }
      .button-login .span-login {
        display: block;
        transition: all 0.3s ease-in-out;
      }
      .button-login svg {
        display: block;
        transform-origin: center center;
        transition: transform 0.3s ease-in-out;
      }
      .button-login:hover .svg-wrapper {
        animation: fly-1 0.6s ease-in-out infinite alternate;
      }
      .button-login:hover svg {
        transform: translateX(1.2em) rotate(45deg) scale(1.1);
      }
      .button-login:hover .span-login {
        transform: translateX(5em);
      }
      button:active {
        transform: scale(0.95);
      }
      @keyframes fly-1 {
        from {
          transform: translateY(0.1em);
        }
        to {
          transform: translateY(-0.1em);
        }
      }
    }
  }
}
.body-content{
  position: relative;
  margin-top: 60px;
  min-height: calc(100vh - 230px);
}
.footer{
  background-color: #ebe9e9;
  height: 150px;
  margin-top: 10px;

}
</style>
