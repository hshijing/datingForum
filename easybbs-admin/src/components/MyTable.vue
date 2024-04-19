<template>
  <div class="table">
    <el-table
      ref="tableRef"
      :data="boardDate||tableData.list || []"
      :height="tabHeight"
      :stripe="options.stripe"
      :border="options.border"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择框 -->
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="options.selectType && options.selectType == 'checkbox'"
      />
      <!-- 序号 -->
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="序号"
        v-if="options.showIndex"
      />
      <!-- 表格数据 -->
      <template v-for="(item, index) in columns" :key="index">
        <template v-if="item.scopedSlots">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
          >
            <template #default="scope">
              <slot
                :name="item.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              >
              </slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
            :fixed="item.fixed"
          />
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="page" v-if="showPagination">
      <el-pagination
        :total="tableData.totalCount"
        :page-size="tableData.pageSize"
        :current-page="tableData.pageNo"
        :page-sizes="[15, 20, 25, 30]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total,sizes,prev, pager, next,jumper"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MyRef } from '../utils/userCompRef'
import { ElTable } from 'element-plus'
interface Options {
  stripe: boolean
  border: boolean
  selectType: string
  showIndex: boolean
  tabHeight: number
  extHeight: number
}
interface Columns {
  prop?: string
  label: string
  align?: string
  width?: number
  scopedSlots?: string
  fixed?: string
}
type colums = Columns[]
const _prpos = defineProps({
  tableData: {
    //表格数据
    type: Object as () => any,
  },
  boardDate:{
    type: Object as () => any,
  },
  showPagination: {
    //是否显示分页
    type: Boolean,
    default: false,
  },
  options: {
    //表格属性
    type: Object as () => Options,
    default: {
      tabHeight: null,
      stripe: true,
      border: false,
      showIndex: true,
      extHeight: 0,
    },
  },
  //板块列表数据专用
  oneBoard:{
    type:Boolean,
    default:true
  },
  columns: {
    //表格数据
    type: Array as () => colums,
    required: true,
  },
  fetch: Function, //表格数据获取方法
  initFetch: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['rowClick', 'rowSetCurrentRow'])
const tableRef = MyRef(ElTable)
const topHeight = 100 + 30 + 30 + 46
//表格高度计算
const tabHeight = ref(
  _prpos.options.tabHeight
    ? _prpos.options.tabHeight
    : window.innerHeight - topHeight - _prpos.options.extHeight,
)
//清除选中
const clearSelection = () => {
  tableRef.value?.clearSelection()
}
//设置行选中
const setCurrentRow = (rowKey: any, rowVal: any) => {
  let row = _prpos.boardDate.find((item: any) => item[rowKey] === rowVal)
  tableRef.value?.setCurrentRow(row)
}
//行点击
const handleRowClick = (row: any) => {
  if(_prpos.oneBoard){
    emit('rowClick', row)
  }
}
//多选
const handleSelectionChange = (row: any) => {
  emit('rowSetCurrentRow', row)
}
//分页点击
const handleCurrentChange = (pageNo: number) => {
  _prpos.tableData.pageNo = pageNo
  _prpos.fetch ? _prpos.fetch() : null
}
//每页显示几条数据下拉框变化触发
const handleSizeChange = (size: number) => {
  _prpos.tableData.pageSize = size
  _prpos.tableData.pageNo = 1
  _prpos.fetch ? _prpos.fetch() : null
}
defineExpose({ setCurrentRow, clearSelection })
</script>

<style scoped>
.page {
  height: 30px;
  padding-top: 3px;
}
.el-pagination {
  justify-content: right;
}
.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}
.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>
