<!-- 文章封面 -->
<template>
  <div class="cover" :style="{width:width+'px',height:width+'px'}">
    <el-image :style="{width:width+'px',height:width+'px'}"
      fit="scale-down" loading="lazy"
      :src="proxy.globalInfo.imageUrl+cover"
    >
    </el-image>
  </div> 
</template>

<script setup lang='js'>
import {getCurrentInstance} from 'vue';
const {proxy} = getCurrentInstance();
defineProps({
  cover:{
    type:String,
  },
  width:{
    type:Number,
    default:60,
  }
})
</script>

<style scoped lang="scss">
.cover{
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
  .el-image__inner{
    width: 100%;
    height: 100%;
  }
}
</style>