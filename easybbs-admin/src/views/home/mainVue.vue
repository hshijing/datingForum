<template>
  <div class="main">
    <div class="tag-main">
      <el-tabs
        type="border-card"
        :style="{border:'none'}"
        v-model="defaultActive"
        @tab-change="tabChange"
        @edit="tabEdit"
      >
        <el-tab-pane
          v-for="item in _porps.tabList"
          :key="item.path"
          :name="item.path"
          :label="item.name"
          :closable="_porps.tabList.length > 1"
        />
      </el-tabs>
    </div>
    <div class="conten">
      <router-view/>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabList {
  path: string
  name: string
}
import { useRouter } from 'vue-router'
import { UserStore } from '../../stores/index'
import { ref, watch } from 'vue'
const useStore = UserStore()
const router = useRouter()
const emit = defineEmits(['changeTabs'])
const _porps = defineProps({
  tabList: { type: Array as () => Array<TabList>, required: true }, //tab切换数据
})
const defaultActive = ref<string>() //当前高亮的tab
//tab点击 切换路由
const tabChange = (e: string) => router.push(e)
//tab关闭 关闭当前标签 选择下一个标签 如果下一个也没有则选择上一个
const tabEdit = (key: string, action: string) => {
  if (action !== 'remove') return //只处理删除操作
  const tabs = _porps.tabList //全部标签页
  let currActive = defaultActive.value //当前选择
  //当前标签页
  if (key === defaultActive.value) {
    tabs.forEach((item: TabList, index: number) => {
      if (item.path === key) {
        let nextTab = tabs[index + 1] || tabs[index - 1]
        //切换到下一个标签页 || 上一个标签页
        currActive = nextTab.path
      }
    })
  }
  //更新当前标签数组 删除当前选择标签
  const tabList = tabs.filter((item: TabList) => item.path !== key) 
  emit('changeTabs', tabList) //通知父组件更新tabs数组
  //切换标签页
  if(currActive !== defaultActive.value) {
    router.push(currActive!)
  } 
/*     let currIndex=tabs.findIndex(item=>item.path===key)//当前选择标签页索引
    if(defaultActive.value===key){
      if(currIndex!==-1){
      let nextTab=tabs[currIndex+1]||tabs[currIndex-1]//下一个||上一个标签页
      //获得删除后的标签页列表
      const tabsList=[...tabs.slice(0,currIndex),...tabs.slice(currIndex+1)]
      emit('changeTabs', tabsList) // 通知父组件更新 tabs 数组
      if(nextTab&&nextTab.path!==currActive){
        router.push(nextTab.path) //切换到下一个标签页
      }
    }
    }else{
      const tabsList=[...tabs.slice(0,currIndex),...tabs.slice(currIndex+1)]
      emit('changeTabs', tabsList) // 通知父组件更新 tabs 数组
    } */
}
//监听路由变化 高亮tab标签
watch(
  () => useStore.deactivate!,
  (newVal) => {
    if (newVal !== undefined || newVal !== null) {
      defaultActive.value = newVal
    }
  },
  { immediate: true, deep: true },
)
</script>

<style lang="scss">
.main{
  padding: 0px;
  .tag-main{
    .el-tabs-border-card{
      border: none !important;
    }
    .el-tabs__content{
      display: none !important;
    }
  }
  .conten{
    overflow: hidden;
    padding: 10px 10px 5px 10px;
  }
}

</style>
