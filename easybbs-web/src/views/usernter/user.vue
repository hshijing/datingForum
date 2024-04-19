<template>
  <div 
    class="user"
    :style="{ width: `${proxy.globalInfo.herderWidth}px` }"
  >
    <!-- 导航栏 -->
    <div class="user-bannel">
      <router-link to="/">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="panel">
      <!-- 用户信息 -->
      <div class="side">
        <usernterInfoVue/>
      </div>
      <!-- 文章相关 -->
      <div class="article">
        <usernterArticleVue/>
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import usernterArticleVue from './usernterArticle.vue';
import usernterInfoVue from './usernterInfo.vue';
import {getCurrentInstance} from 'vue';
const {proxy} = getCurrentInstance();
</script>

<style scoped lang="scss">
.user{
  margin: 0 auto;
  .user-bannel{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #555666;
    margin: 10px;
    .icon-right{
      padding: 0px 5px;
      color: #555666;
    }
    a{
      text-decoration: none;
      color: #555666;
    }
  }
  .panel{
    display: flex;
    .side{
      width: 300px;
      margin-right: 15px;
    }
    .article{
      background-color: #ffffff;
      padding: 10px;
      flex: 1;
    }
  }
}
</style>