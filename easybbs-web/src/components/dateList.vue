<template>
  <!-- 骨架 数据未响应 展示 -->
  <div class="skeleton" v-if="_props._loding">
    <el-skeleton :rows="3" animated />
  </div>
  <!-- 文章数据 -->
  <template v-else>
      <div class="date" v-for="item in _props.dateSource.list">
      <slot :date="item" /><!-- 插槽显示 相当于套个外层容器  拥有分页器 -->
    </div>
  </template>
  <!-- 空状态 无数据 -->
  <div   class="Nodate"
    v-if="!_loding && dateSource.list && dateSource.list.length === 0"
  >
    <!-- 无数据组件 -->
    <noDateCmp :msg="dateListMsg" />
  </div>
  <!-- 分页器 -->
  <div class="page" v-else>
    <el-pagination 
      background
      :disabled="_props.dateSource.pageTotal < 1"
      layout="prev, pager, next"
      style="text-align: right"
      v-model="_props.dateSource.pageNo"
      @current-change="handleCurrentChange"
      :total="_props.dateSource.totalCount"
      :page-size="_props.dateSource.pageSize"
    ></el-pagination>
  </div>
</template>

<script setup lang="js">
import noDateCmp from './noDate.vue';
const _props=defineProps({
  dateSource:{
    type:Object,
  },
  _loding:{
    type:Boolean,
  },
  dateListMsg:{
    type:String,
    default:'暂无数据'
  },
})
const emit=defineEmits(['locatDate'])
//传递点击分页器事件给父组件
const handleCurrentChange=(pageNo)=>{
  emit('locatDate',pageNo)
}
</script>

<style scoped lang="scss">
.page {
  padding: 10px;
}
.skeleton {
  padding: 10px;
}
</style>
