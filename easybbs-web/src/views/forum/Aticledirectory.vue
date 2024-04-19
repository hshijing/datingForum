<!-- 目录组件 -->
<template>
  <div>
    <div class="toc-title">目录</div>
    <div class="toc-list">
      <template v-if="tocArray.length === 0">
        <div class="no-toc">未解析到目录</div>
      </template>
      <template v-else>
        <div v-for="item in props.tocArray" :key="item.id">
          <span
            :class="['toc-item', item.id == anchoId ? 'active' : '']"
            :style="{ marginLeft: item.level * 10 + 'px' }"
            @click="goToAnchor(item.id)"
          >
            {{ item.title }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({
  tocArray: {
    type: Array,
    default: [],
    required: true
  }
})
const anchoId = ref(0)
//点击目录标题跳转对应锚点
const goToAnchor = (domId) =>{
  //跳转到指定锚点
  const dom = document.getElementById(domId)
  dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
//获取滚动条的位置
const getScrollTop = () =>
{
  return document.documentElement.scrollTop || document.body.scrollTop;
}
//滚动条监听
const SetScrollTop = () =>{
  let curTop = getScrollTop();
  let found = false;
  for(let i = 0,len=props.tocArray.length; i < len; i++){
    const item = props.tocArray[i];
    if (
      (i < props.tocArray.length - 1 &&
        curTop >= props.tocArray[i].offsetTop &&
        curTop < props.tocArray[i + 1].offsetTop) ||
      (i === props.tocArray.length - 1 && curTop >= props.tocArray[i].offsetTop)
    ) {
      anchoId.value = item.id;
      found = true;
      break;
    }
  }
  if (!found) {
    anchoId.value = null; // 如果没有找到对应标题，取消高亮
  }
}
//监听滚动条位置
onMounted(() =>
{
  window.addEventListener('scroll', SetScrollTop, false)
})
//取消监听
onUnmounted(() =>
{
  window.removeEventListener('scroll', SetScrollTop, false)
})
</script>

<style scoped lang="scss">
.toc-title {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.toc-list {
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 5px;

  .no-toc {
    text-align: center;
    color: #555666;
    line-height: 40px;
    font-size: 15px;
  }

  .toc-item {
    cursor: pointer;
    display: block;
    line-height: 35px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #555666;
    font-size: 15px;
    border-left: 2px solid #ffffff;
  }

  .toc-item:hover {
    background: #e2e1e1;
  }

  .active {
    border-left: 2px solid #409eff;
    border-radius: 0px 3px 3px 0px;
  }
}
</style>
