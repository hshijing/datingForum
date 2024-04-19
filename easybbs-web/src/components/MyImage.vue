<!-- 图片预览 -->
<template>
  <div class="my-image">
    <el-image-viewer
    :initial-index="MyImageIndex"
    hide-on-click-modal
    :url-list="imageList"
    @close="closeImageViewer"
    v-if="MyImageIndex!=undefined"
    />
  </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
//当前显示预览的图片下标
const MyImageIndex=ref(undefined)
//预览关闭
const closeImageViewer=()=>{
  MyImageIndex.value=undefined //关闭预览
  //恢复滚动条
  document.body.style.overflow='auto'
}
//点击赋值下标进行预览
const show=(index)=>{
  MyImageIndex.value=index
  //干掉滚动条 防止鼠标滚轮放大缩小图片是与滚动条冲突
  document.body.style.overflow='hidden'
}
//暴露方法
defineExpose({show})
defineProps({
  imageList:{
    type:Array,
    default:[]
  }
})
</script>

<style scoped lang="scss">
.my-image{
  :deep(.el-image-viewer__mask) {
      opacity: 0.7;
    }
}
</style>