<!-- 修改板块弹出框 -->
<template>
  <div>
    <MydilongVue
      :show="DilongDate.show"
      :show-close="DilongDate.showClose"
      :titel="DilongDate.titel"
      width="400px"
      top="200px"
      @close="DilongDate.show=false"
    >
      <el-form :model="formDate" ref="formRef" :rules="rules">
        <el-form-item label="标题">
          {{ formDate.title }}
        </el-form-item>
        <el-form-item label="板块" prop="boardIds">
          <el-cascader
            placeholder="请输入板块"
            :options="boardList"
            :props="boardProps"
            v-model="formDate.boardIds"
            :style="{ width: '100%' }"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="sendBoard"
            :style="{ 'margin-left': '300px' }"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </MydilongVue>
  </div>
</template>

<script setup lang="ts">
interface DILONG {
  show: boolean
  showClose: boolean
  titel: string
}
import MydilongVue from '../../../components/Mydilong.vue'//弹窗组件
import {
  ReqloadBoard,
  RequpdateBoard,
  updateBoard,
  loadBoardArr,
} from '../../../api/article/index'
import {ArticleObj} from '../articleLIstDate';//文章类型
import { MyRef } from '../../../utils/userCompRef'//自定义ref
import { ElForm } from 'element-plus'
import { ref, nextTick } from 'vue'
//弹窗数据
const DilongDate = ref<DILONG>({
  show: false,
  showClose: true,
  titel: '修改板块',
})
const emit=defineEmits(['reload'])
const formRef = MyRef(ElForm) //表单实例
//表单数据
const formDate = ref<any>({})
//表单校验
const rules = {
  boardIds: [{ required: true, message: '请选择板块' }],
}
//表单板块信息
const boardList = ref<loadBoardArr>()
//表单板块映射
const boardProps = ref({
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName',
})
//获取板块信息
const getBoard = async () => {
  try {
    const res = await ReqloadBoard()
    if (!res) return
    boardList.value = res.data
  } catch (error) {
    throw error
  }
}
//保存按钮
const sendBoard = async () => {
  try {
    //整理参数
    const params: updateBoard = {
      articleId: formDate.value.articleId,
      pBoardId: formDate.value.boardIds
        ? formDate.value.boardIds[0]
        : undefined,

      boardId: formDate.value.boardIds&&formDate.value.boardIds[1]
        ? formDate.value.boardIds[1]
        : undefined,
    }
    await formRef.value?.validate()//表单校验
    const res=await RequpdateBoard(params)
    if(!res) return 
    DilongDate.value.show = false//关闭弹窗
    emit('reload')//刷新列表
  } catch (error) {
    throw error
  }
}
//修改板块 暴露给父组件 date回显每个文章的详细数据
const updateBoardClick = (date: ArticleObj) => {
  DilongDate.value.show = true//打开弹窗
  nextTick(() => {
    formRef.value?.resetFields()
    //整理数据
    date.boardIds = []
    date.boardIds.push(date.pBoardId)
    if (date.boardId != null && date.boardId != 0) {
      date.boardIds.push(date.boardId)
    }
    //数据回显
    formDate.value = date
  })
}
getBoard()
defineExpose({ updateBoardClick })
</script>

<style scoped></style>
