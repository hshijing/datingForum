<template>
  <div class="aside">
    <div class="logo">
      <span v-if="!isCollapse">dating Forum管理后台</span>
      <img class="img" v-else src="../../assets/img/login.jpg" alt="">
    </div>
    <div class="menu">
      <el-menu
        :default-openeds="defaultOpeneds"
        :default-active="defaultActive"
        :collapse="_props.isCollapse"
        :collapse-transition="false"
        class="el-menu-vertical-demo"
        background-color="#bfbfbf"
        text-color="#fff"
        active-color=" red"
        router
      >
        <template v-for="item in menuList" :key="item.path">
          <el-sub-menu :index="item.path" v-if="item.children">
            <template #title>
              <i :class="['iconfont', item.icon]"></i>
              <span class="menu-name">{{ item.menuName }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <span class="menu-name">{{ child.menuName }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <i :class="['iconfont', item.icon]"></i>
              <span class="menu-name">{{ item.menuName }}</span>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { menuList} from './menuList';
import { ref} from "vue";
const _props=defineProps({
  isCollapse:Boolean,//是否折叠
  defaultActive:{//默认激活的菜单
    type:String,
    default:''
  }
})
const defaultOpeneds = ref<string[]>([]); //默认展开的菜单
//默认展开的菜单
const initDefaultOpeneds=()=>{
  menuList.forEach(item=>{
    defaultOpeneds.value.push(item.path); //默认展开的菜单
  })
}
initDefaultOpeneds()

</script>

<style scoped lang="scss">
.el-popper{
  border: none !important;

  .el-menu-item.is-active{
    color: #191919;
    background: #ffffff;
  }
  .el-menu-item:hover{
    color: #191919;
    background: #91c2f6;
  }
  .el-menu-popup{
    padding: 0px;
  }
}
.aside {
  .logo {
    display: flex;
    height: 50px;
    color: #000000;
    background: #ffffff;
    align-items: center;
    font-size: 20px;
    padding-left: 5px;
    cursor: pointer;
    .img{
      width: 60px;
      height: 60px;
    }
  }

  .menu {
    height: calc(100vh - 50px);
    .menu-name {
      padding-left: 10px;
    }
    .el-menu {
      border-right: none;
    }
    .el-menu-item {
      background-color: #ffffff;
      color: #000000;
    }

    .el-menu-item.is-active {
      color: #191919;
      background: #cae3fd;
    }

    .el-menu-item:hover {
      color: #191919;
      background: #91c2f6;
    }
  }
}
</style>
