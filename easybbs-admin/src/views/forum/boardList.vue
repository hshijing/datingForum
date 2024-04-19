<template>
  <div>
    <el-row :gutter="10" :style="{ marginTop: '10px' }">
      <!-- 一级板块 -->
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级板块</span>
              <span class="a-link" @click="editBorad(null, 'add', 0)"
                >新增一级板块</span
              >
            </div>
          </template>
          <MyTableVue
            v-if="OneTableData"
            :columns="colums"
            ref="MyTableOneRef"
            :boardDate="OneTableData"
            :tabHeight="100"
            :options="(Options as any)"
            :showPagination="false"
            @rowClick="rowClick"
          >
            <!-- 文章封面-->
            <template #cover="{ row }: { row: loadBoardObj }">
              <CoverVue :cover="row.cover" />
            </template>
            <!--板块信息 -->
            <template #board="{ row }: { row: loadBoardObj }">
              <div>板块昵称:{{ row.boardName }}</div>
              <div>
                发帖权限:{{
                  row.postType == 0 ? '只允许管理员发帖' : '任何人可发帖'
                }}
              </div>
            </template>
            <!--操作 -->
            <template
              #op="{ index, row }: { index: number, row: loadBoardObj }"
            >
              <span class="a-link" @click="editBorad(row, 'update', 0)"
                >修改</span
              >
              <el-divider direction="vertical" />
              <span class="a-link" @click="deleteBorad(row)">删除</span>
              <el-divider direction="vertical" />
              <span
                @click="changeBoradSort(index, 'up', 0)"
                :class="[index == 0 ? 'no-allow' : 'a-link']"
              >
                上移
              </span>
              <el-divider direction="vertical" />
              <span
                @click="changeBoradSort(index, 'down', 0)"
                :class="[
                  index == OneTableData.length - 1 ? 'no-allow' : 'a-link',
                ]"
              >
                下移
              </span>
            </template>
          </MyTableVue>
        </el-card>
      </el-col>
      <!-- 二级板块 -->
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级板块</span>
              <span class="a-link" @click="editBorad(null, 'add', 1)">
                新增二级板块
              </span>
            </div>
          </template>
          <MyTableVue
            v-if="TwoTableData"
            :columns="colums"
            ref="MyTableTowRef"
            :boardDate="TwoTableData"
            :oneBoard="false"
            :tabHeight="100"
            :options="(Options as any)"
            :showPagination="false"
            @rowClick="rowClick"
          >
            <!-- 文章封面-->
            <template #cover="{ row }: { row: loadBoardObj }">
              <CoverVue :cover="row.cover" />
            </template>
            <!--板块信息 -->
            <template #board="{ row }: { row: loadBoardObj }">
              <div>板块昵称:{{ row.boardName }}</div>
              <div>
                发帖权限:{{
                  row.postType == 0 ? '只允许管理员发帖' : '任何人可发帖'
                }}
              </div>
            </template>
            <!--操作 -->
            <template
              #op="{ index, row }: { index: number, row: loadBoardObj }"
            >
              <span class="a-link" @click="editBorad(row, 'update', 1)"
                >修改</span
              >
              <el-divider direction="vertical" />
              <span class="a-link" @click="deleteBorad(row)">删除</span>
              <el-divider direction="vertical" />
              <span
                @click="changeBoradSort(index, 'up', 1)"
                :class="[index == 0 ? 'no-allow' : 'a-link']"
              >
                上移
              </span>
              <el-divider direction="vertical" />
              <span
                @click="changeBoradSort(index, 'down', 1)"
                :class="[
                  index == TwoTableData.length - 1 ? 'no-allow' : 'a-link',
                ]"
              >
                下移
              </span>
            </template>
          </MyTableVue>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- 新增修改弹窗 -->
  <MydilongVue
    :show="DilongDate.show"
    :show-close="DilongDate.showClose"
    :titel="DilongDate.titel"
    width="400px"
    top="200px"
    @close="DilongDate.show = false"
  >
    <el-form :model="formDate" :rules="rules" ref="formRef">
      <el-form-item
        label="一级板块:"
        prop="boardName"
        v-if="formDate.boardType == 1"
      >
        {{ formDate.pBoardName }}
      </el-form-item>
      <el-form-item label="板块名称:" prop="boardName">
        <el-input
          v-model="formDate.boardName"
          placeholder="请输入板块名称"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="发帖权限:" prop="postType">
        <el-radio-group v-model="formDate.postType">
          <el-radio :label="0">只允许管理员发帖</el-radio>
          <el-radio :label="1">任何人可发帖</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面:" prop="cover">
        <FormCoverVue v-model="formDate.cover" />
      </el-form-item>
      <el-form-item label="简介:" prop="boardDesc">
        <el-input
          v-model="formDate.boardDesc"
          type="textarea"
          maxlength="200"
          placeholder="请输入板块简介"
          :rows="4"
          resize="none"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="sendDikong"
          :style="{ position: 'relative', left: '300px' }"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </MydilongVue>
</template>

<script setup lang="ts">
import MyTableVue from '../../components/MyTable.vue' //表格组件
import CoverVue from '../../components/Cover.vue' //封面组件
import FormCoverVue from '../../components/FormCover.vue' //封面组件
import MydilongVue from '../../components/Mydilong.vue' //弹窗组件
import { ElForm, ElMessage } from 'element-plus'
import { MyRef } from '../../utils/userCompRef'
import { confirm } from '../../utils/Confirm'
import { colums, rules } from './boardList'
import { ref, onMounted, nextTick } from 'vue'
import {
  ReqloadBoard,
  ReqsaveBoard,
  ReqdelBoard,
  ReqchangeBoardSort,
  loadBoardArr,
  loadBoardObj,
} from '../../api/board/index'
//一级板块表格实例
const MyTableOneRef = ref()
//一级板块
const OneTableData = ref<loadBoardArr>([])
//二级板块表格实例
const MyTableTowRef = ref()
//二级板块
const TwoTableData = ref<loadBoardArr>([])
//默认显示第一个板块的二级板块
const defaultBoard = ref<loadBoardObj>()
//弹窗数据
const DilongDate = ref({
  show: false,
  showClose: true,
  titel: '修改板块',
})
//板块表格属性
const Options = ref({
  tabHeight: 670,
  extHeight: 0,
  stripe: true,
  border: false,
  showIndex: false,
  selectType: '',
})
//弹窗表单数据
const formDate = ref<any>({})
//弹窗表单实例
const formRef = MyRef(ElForm)
//获取所有板块
const getBoardList = async () => {
  try {
    const res = await ReqloadBoard()
    if (res.code === 200) {
      OneTableData.value = res.data
      //默认显示第一个板块的二级板块
      if (defaultBoard.value == undefined && res.data.length > 0) {
        defaultBoard.value = res.data[0] //默认选择第一个板块
        rowClick(res.data[0])
      } else {
        defaultBoard.value = res.data.find(
          (item) => item.boardId == defaultBoard.value?.boardId,
        )
        rowClick(defaultBoard.value!)
      }
      nextTick(() => {
        //调用子组件方法进行选中
        MyTableOneRef.value.setCurrentRow(
          'boardId',
          defaultBoard.value?.boardId,
        )
      })
    }
  } catch (error) {
    ElMessage.error('未知错误')
    throw error
  }
}
//行点击事件 点击后回显数据 然后显示二级板块
const rowClick = (row: loadBoardObj) => {
  defaultBoard.value = row //记录默认选择的板块
  //回显数据 然后显示二级板块
  //@ts-ignore
  if (row && row.children) {
    //@ts-ignore
    TwoTableData.value = row.children
  }
}
//新增|编辑板块
const editBorad = (row: loadBoardObj | null, op: string, type: number) => {
  DilongDate.value.show = true
  nextTick(() => {
    formRef.value?.resetFields()
    if (op === 'add') {
      //新增参数整理
      DilongDate.value.titel = type === 0 ? '新增板块' : '新增二级板块'
      formDate.value = {}
      formDate.value.cover = { imageUrl: '' }
    } else if (op === 'update') {
      //修改参数整理
      DilongDate.value.titel = type === 0 ? '修改板块' : '修改二级板块'
      formDate.value = JSON.parse(JSON.stringify(row))
      //处理封面参数
      if (formDate.value.cover) {
        formDate.value.cover = { imageUrl: formDate.value.cover }
      }
    }

    formDate.value.boardType = type //板块区分
    if (type == 1) {
      //处理二级板块的回显
      formDate.value.pBoardName = defaultBoard.value?.boardName
      formDate.value.pBoardId = defaultBoard.value?.boardId
    } else {
      formDate.value.pBoardId = 0
    }
  })
}

//删除板块
const deleteBorad = (row: loadBoardObj) => {
  try {
    confirm(`确定删除【${row.boardName}】板块？`, async () => {
      const res = await ReqdelBoard(row.boardId)
      if (!res) return
      //如果删除为当前选中？重置默认展开二级板块的一级板块
      if(defaultBoard.value?.boardId==row.boardId){
        defaultBoard.value=null!
      }
      ElMessage.success('删除成功')
      getBoardList()
    })
  } catch (error) {
    ElMessage.error('删除失败')
    throw error
  }
}
//编辑板块排序
const changeBoradSort = async(index: number, type: string, op: number) => {
  let date;
  //操作的是一级板块或者二级板块
  op==0?date=OneTableData.value:date=TwoTableData.value
  //边界处理 不允许第一个板块上移||最后一个板块下移
  const top=index==0&&type==='up'
  const bom=index==date.length-1&&type==='down'
  if(top||bom)return

  //交换位置
  const temp=date[index]//当前操作数据
  const number=type==='up'?-1:1//移动的距离
  date.splice(index, 1)//删除当前操作数据
  date.splice(index+number, 0, temp)//在移动的距离位置插入当前操作数据

  //更新排序 板块id
  const boardIds=[number]
  date.forEach((item: loadBoardObj,)=>{
    boardIds.push(item.boardId)
  })
  //发送请求
  try {
    const res=await ReqchangeBoardSort(boardIds.join(','))
    if(!res) return
    ElMessage.success('排序成功')
  } catch (error) {
    ElMessage.error('排序失败')
    throw error
  }
}
//弹窗保存按钮
const sendDikong = () => {
  try {
    formRef.value?.validate(async (vld) => {
      if (!vld) return
      //处理携带参数
      let params = Object.assign({}, formDate.value)
      delete params.children
      //封面处理
      if (!(params.cover instanceof File)) {
        delete params.cover
      }
      //请求
      const res = await ReqsaveBoard(params)
      if (res.code == 200) {
        DilongDate.value.show = false
        ElMessage.success('保存成功')
        //更新页面
        getBoardList()
      }
    })
  } catch (error) {
    DilongDate.value.show = false
    ElMessage.error('保存失败')
    throw error
  }
}
onMounted(() => {
  getBoardList()
})
</script>

<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
}
.no-allow {
  cursor: not-allowed;
  color: #ddd;
}
</style>
