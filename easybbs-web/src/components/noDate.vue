<!-- 无数据显示骨架 -->
<template>
  <div class="no-date">
    <span class="iconfont icon-empty"></span>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup lang='js'>
defineProps({
  msg:{
    type:String,
    required:true
  }
})
</script>

<style scoped lang="scss">
.no-date{
  text-align: center;
  padding: 10px 0;
  .icon-empty{
    color: #bbb;
    font-size: 100px;
  }
  .msg{
    color: #909399;
    font-size: 15px;
    margin-top: 10px;
  }
}
</style>