<!-- 文章封面 -->
<template>
  <div class="cover" :style="{width:width+'px',height:width+'px'}">
    <el-image :style="{width:width+'px',height:width+'px'}"
      fit="scale-down" loading="lazy"
      :src="cover?proxy.globalInfo.imageUrl+cover:localCover"
    >
    </el-image>
  </div> 
</template>

<script setup lang='ts'>
import {getCurrentInstance} from 'vue';
const {proxy} = getCurrentInstance() as any;
defineProps({
  cover:{//封面地址路径
    type:String,
  },
  width:{
    type:Number,
    default:60,
  }
})
//默认封面
const localCover=new URL('../assets/img/login.jpg',import.meta.url).href
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