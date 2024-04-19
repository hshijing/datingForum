<template>
  <div class="layout">
    <el-container class="container">
      <!-- 左侧菜单 -->
      <el-aside :style="{ width: asideWidth + 'px' }" class="Aside">
        <asideVue :isCollapse="isCollapse" :defaultActive="defaultActive" />
      </el-aside>
      <el-container>
        <!-- 导航栏 -->
        <el-header class="header">
          <div
            :class="['iconfont', isCollapse ? 'icon-expand' : 'icon-collapse']"
            @click="ShowMenu"
          ></div>
          <div class="menu-board">
            <el-breadcrumb>
              <template v-for="item in menuBreaList" :key="item.name">
                <el-breadcrumb-item v-if="item.name">
                  {{ item.name }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
          <div>
          </div>
        </el-header>
        <!-- 内容 -->
        <el-main class="Main">
          <mainVue
            :tabList="tabList"
            :defaultActive="defaultActive"
            @changeTabs="changeTabsClick"
          />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
interface TabList {
  path: string
  name: string
}
import asideVue from './asideVue.vue' //左侧菜单
import mainVue from './mainVue.vue' //右侧内容
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { UserStore } from '../../stores/index'
const userStore = UserStore()
const route = useRoute()
const asideWidth = ref<number>(240) //菜单宽度
const isCollapse = ref<boolean>(false) //是否折叠菜单
const defaultActive = ref<string>() //默认激活的菜单
const menuBreaList = ref<any>([]) //顶部导航栏面包屑
const tabList = ref<any>([]) //tab操作切换数据
//点击按钮菜单折叠Or展开
const ShowMenu = () => {
  isCollapse.value = !isCollapse.value
  asideWidth.value = isCollapse.value ? 64 : 240
}
//子组件进行操作后的tabs数据
const changeTabsClick = (date: TabList[]) => {
  tabList.value = date
}
//监听路由 处理路由参数
watch(
  () => route,
  () => {
    defaultActive.value = route.path//默认激活的菜单
    menuBreaList.value = route.matched//顶部导航栏面包屑
    userStore.Updatedeactivate(defaultActive.value)//存储高亮选中
    let findItem = tabList.value.find((item: any) => item.path == route.path)
    if (!findItem) {
      tabList.value.push({ path: route.path, name: route.name })
    }
  },
  { immediate: true, deep: true },
)
</script>
<style lang="scss" scoped>
.layout {
  .container {
    .Aside {
      background-color: rgb(255, 255, 255);
      transition: 0.3s;
    }
    .header {
      background: #fff;
      border-bottom: 1px solid #ddd;
      height: 50px;
      line-height: 50px;
      padding: 0px 10px !important;
      display: flex;
      align-items: center;
      .iconfont {
        cursor: pointer;
      }
      .op-menu {
        font-size: 20px;
        cursor: pointer;
        color: #ddd;
      }
      .menu-board {
        margin-left: 10px;
      }
    }
  }
}
</style>
