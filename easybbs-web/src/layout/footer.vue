<template>
  <div
    class="footer-content"
    :style="{ width: `${proxy.globalInfo.herderWidth}px` }"
  >
    <el-row>
      <el-col :span="6" class="item">
        <div class="logo">
          <div class="login-letter">
            <img src="../assets/img1702213725513.png" alt="首页" />
          </div>
          <div class="info">一个可以摸鱼的编程社区</div>
        </div>
      </el-col>
      <el-col :span="9" class="item">
        <div class="title">网站相关</div>
        <div class="item-content">
          <span @click="goToClick(0)">问题反馈</span>
        </div>
        <div class="item-content">
          <span @click="goToClick(1)">社区规范</span>
        </div>
        <div class="item-content">
          <span @click="goToClick(2)">免责声明</span>
        </div>
      </el-col>
      <el-col :span="9" class="item">
        <div class="title">联系站长</div>
        <div class="img">
          <img src="../assets/微信.jpg" alt="weixin" />
          <div class="content">
            <div>扫</div>
            <div>🐎</div>
            <div>添</div>
            <div>加</div>
            <div>站</div>
            <div>长</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="js">
import { getCurrentInstance, watch } from 'vue';
import {useRoute,useRouter} from 'vue-router';
const {proxy} = getCurrentInstance();
const router=useRouter()
const route=useRoute() 
const guiFan='IzD2vmsM2CBl7Z1'
const mianZe='7tETUsq1CqVkGJd'
const bug='e6bSCOytQBQ8Od8'
const goToClick=(type)=>{
  if(type===0){
    router.push(`/post/${bug}`)
  }else if(type===1){
    router.push(`/post/${guiFan}`)
  }else{
    router.push(`/post/${mianZe}`)
  }
}
watch(
  ()=>route.params.acticleId,
  (newVal,oldVal)=>{
    if(newVal!==undefined&&newVal!==oldVal){
      router.push(`/post/${newVal}`)
      router.go(0)//vue内部watch错误，只能通过刷新页面进行更新数据
    }
  },
  )
</script>

<style scoped lang="scss">
.footer-content {
  margin: 0 auto;
  padding-top: 10px;
  .item {
    text-align: left;
    .title {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .item-content {
      margin-top: 10px;
      span{
        font-size: 15px;
        cursor: pointer;
        text-decoration: none;
        color: black;
      }
    }
    .img {
      width: 100px;
      height: 100px;
      img {
        width: 100%;
      }
      .content {
        position: relative;
        left: 110px;
        top: -100px;
        font-size: 12px;
      }
    }
  }
  .logo {
    .login-letter {
      position: relative;
      top: -15px;
      left: -20px;
      img {
        width: 400px;
      }
    }
  }
}
</style>
