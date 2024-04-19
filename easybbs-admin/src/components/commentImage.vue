<!-- 评论区图片显示 -->
<template>
  <el-image
  class="comment-img"
  :src="src"
  :zoom-rate="1.2"
  :preview-src-list="imgList?imgList:[src]"
  :initial-index="0"
  fit="scale-down"
  loading="lazy"
  hide-on-click-modal
  />
</template>

<script setup lang='ts'>
defineProps({
  src:String,//图片地址
  imgList:Array
})
</script>

<style scoped lang="scss">
.comment-img{
  width: 80px;
  height: 80px;
  background: #eee;
}
</style>