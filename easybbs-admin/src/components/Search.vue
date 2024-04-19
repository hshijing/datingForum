<!-- 搜索组件 -->
<template>
  <div class="search">
    <el-form :model="searchForm" label-width="50px">
      <el-row>
        <!-- 标题 -->
        <el-col :span="4" v-if="showTitle">
          <el-form-item label="标题" prop="titleFuzzy">
            <el-input
              v-model="searchForm.titleFuzzy"
              placeholder="请输入标题"
              @keyup.enter="loadDataList"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="showContent">
          <el-form-item label="内容" prop="titleFuzzy">
            <el-input
              v-model="searchForm.contentFuzzy"
              placeholder="请输入标题"
              @keyup.enter="loadDataList"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- 昵称 -->
        <el-col :span="4">
          <el-form-item label="昵称" prop="nickNameFuzzy">
            <el-input
              v-model="searchForm.nickNameFuzzy"
              placeholder="请输入昵称"
              @keyup.enter="loadDataList"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- 板块 -->
        <el-col :span="4" v-if="showTitle">
          <el-form-item label="板块" prop="boardList">
            <el-cascader
              placeholder="请输入板块"
              :options="boardList"
              :props="boardProps"
              v-model="searchForm.boardList"
              :style="{ width: '100%' }"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- 附件 -->
        <el-col :span="4" v-if="showTitle">
          <el-form-item label="附件" prop="attachmentType">
            <el-select
              placeholder="请选择"
              v-model="searchForm.attachmentType"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option :value="0" label="无附件"></el-option>
              <el-option :value="1" label="有附件"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 状态 -->
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-select
              placeholder="请选择"
              v-model="searchForm.status"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option :value="-1" label="已删除"></el-option>
              <el-option :value="0" label="待审核"></el-option>
              <el-option :value="1" label="已审核"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 置顶 -->
        <el-col :span="4" v-if="showTitle">
          <el-form-item label="置顶" prop="topType">
            <el-select
              placeholder="请选择"
              v-model="searchForm.topType"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option :value="0" label="未置顶"></el-option>
              <el-option :value="1" label="已置顶"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="5" :style="{ 'padding-left': '20px'}">
          <el-button-group>
            <el-button type="primary" @click="loadDataList">搜索</el-button>
            <el-button type="info" @click="resetSearch">重置</el-button>
            <el-button
              type="success"
              @click="auditBatch"
              :disabled="selectBatchList.length === 0"
              >批量审批</el-button
            >
            <el-button
              type="danger"
              @click="deleteBatch"
              :disabled="selectBatchList.length === 0"
              >批量删除</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import {loadBoardArr} from '../api/article/index';
defineProps({
  //表单数据收集
  searchForm:{
    type:Object,
    required:true
  },
  //板块信息
  boardList:{
    type:Array as ()=>loadBoardArr,
  },
  //板块映射
  boardProps:{
    type:Object,
  },
  //批量选择
  selectBatchList:{
    type:Array,
    required:true
  },
  showContent:{
    type:Boolean,
    default:false
  },
  showTitle:{
    type:Boolean,
    default:false
  }
})
const emit=defineEmits([
  'searchClick',
  'auditBatchClick',
  'deleteBatchClick',
  'resetSearchClick'
])
//搜索按钮  父组件调用对应方法传入数据
const loadDataList = () =>emit('searchClick')
//重置搜索  父组件调用对应方法传入数据
const resetSearch=()=>emit('resetSearchClick')
//批量审批  父组件调用对应方法传入数据
const auditBatch = () => emit('auditBatchClick')
//批量删除  父组件调用对应方法传入数据
const deleteBatch = () => emit('deleteBatchClick')

</script>

<style scoped></style>
