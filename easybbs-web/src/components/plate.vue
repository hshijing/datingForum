<!-- 板块组件 -->
<template>
  <router-link to="/" :class="['plateList',activePboarId==0?'active':'']"
  >首页
  </router-link>
  <div class="plateList"
    v-for="item in plateList" :key="item.boardId">
    <el-popover v-if="item.children.length > 0"
      class="plateList-popover" 
      placement="bottom-start"
      :width="300"
      trigger="hover"
    >
    <!-- 一级板块 -->
      <template #reference>
        <span :class="['plateList-span',activePboarId==item.boardId?'active':'']"
          @click="boardClickHandler(item)">
          {{ item.boardName }}
        </span>
      </template>
    <!-- 二级板块 -->
      <div class="plateList-div">
        <span :class="['plateList-towPlate',activeBoarId==child.boardId?'active':'']"
          v-for="child in item.children"
          :key="child.boardId" @click="subBoardClick(item,child)">
          {{ child.boardName}}
        </span>
      </div>
    </el-popover>
    <!-- 无子分类的一级板块 -->
    <span v-else :class="['plateList-span',activePboarId==item.boardId?'active':'']" @click="boardClickHandler(item)">
      {{ item.boardName }}
    </span>
  </div>
</template>

<script setup lang="js">
import {useRouter} from 'vue-router';
import {watch,ref} from 'vue';
import { store } from '@/vuex';
const router=useRouter()
//获取板块信息
const plateList=JSON.parse(localStorage.getItem('PlateListInfo'))
//一级板块 点击按钮
const boardClickHandler=(item)=>{
  //跳转到对应一级板块的页面 
  router.push(`/forum/${item.boardId}`)
}
//二级板块点击按钮
const subBoardClick=(item,child)=>{
  //跳转到对应二级板块的页面 
  router.push(`/forum/${item.boardId}/${child.boardId}`)
}
//当前选中的一级板块 ->高亮
const activePboarId=ref(0)
//当前选中的二级板块 ->高亮
const activeBoarId=ref(0)
//监听当前仓库一级id变化 ->给高亮
watch(
  ()=>store.state.plate.AcivePboardId,
  (newVal)=>{
    activePboarId.value=newVal?newVal:0
  },
  {deep:true,immediate:true}
)
//监听当前仓库二级id变化 ->给高亮
watch(
  ()=>store.state.plate.AciveboarId,
  (newVal)=>{
    activeBoarId.value=newVal?newVal:0
  },
  {deep:true,immediate:true}
)
</script>

<style scoped lang="scss">
span{
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.plateList{
  margin: 0 20px;
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  color:#2f3133;
  text-decoration: none;
  top: 0px;
  cursor: pointer;
}
.plateList-div{
  display: flex;
  flex-wrap: wrap;
  .plateList-towPlate{
    padding: 0px 10px;
    border-radius: 20px;
    margin-left: 10px;
    background: #ddd;
    margin-top: 5px;
    cursor: pointer;
  }
}
.active{
  color:#409eff;
  font-size: 20px;
}
</style>
