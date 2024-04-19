<template>
  <div>
    <div class="search-panl">
      <SearchVue
        :search-form="searchForm"
        :select-batch-list="selectBatchList"
        :showContent="true"
        @searchClick="getCommentList"
        @resetSearchClick="resetClick"
        @auditBatchClick="auditBatch"
        @deleteBatchClick="deleteBatch"
        ref="SearchRef"
      />
    </div>
    <div class="list">
      <MyTableVue
        v-if="tableData"
        :columns="colums"
        ref="MyTableRef"
        :options="options"
        :tableData="tableData"
        :fetch="getCommentList"
        :tabHeight="100"
        @rowSetCurrentRow="SetCurrentRow"
        :showPagination="true"
      >
        <!-- 用户信息 -->
        <template #UserInfo="{ row }: { row: LISTObj }">
          <div class="user-info">
            <userInfoVue :userId="row.userId" />
            <div class="name-info">
              <div>
                <a
                  class="a-link"
                  :href="`${proxy.globalInfo.webUrl}user/${row.userId}`"
                  target="_blank"
                  >{{ row.nickName }}
                </a>
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>
        <!-- 查看文章 -->
        <template #contentInfo="{ row }: { row: LISTObj }">
          <span>
            <a
              class="a-link"
              target="_blank"
              :href="`${proxy.globalInfo.webUrl}post/${row.articleId}`"
            >
              查看文章
            </a>
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
            <commentImageVue
              :src="proxy.globalInfo.imageUrl + row.imgPath.replace('.', '_.')"
              :img-list="[proxy.globalInfo.imageUrl + row.imgPath]"
            />
          </div>
        </template>
        <!-- 点赞 -->
        <template #goodContInfo="{ row }: { row: LISTObj }">
          <span>&nbsp;{{ row.goodCount }}&nbsp;</span>
        </template>
        <!-- 文章状态 -->
        <template #statusInfo="{ row }: { row: LISTObj }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: '#715b5b' }"
            >待审核</span
          >
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
        </template>
        <!-- 操作 -->
        <template #op="{ row }: { row: LISTObj }">
          <div class="op-btns" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="deleteComment(row)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="auditComment(row)">
                    审核
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </MyTableVue>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchVue from '../../components/Search.vue'//搜索组件
import MyTableVue from '../../components/MyTable.vue'//表格组件
import userInfoVue from '../../components/userInfo.vue'//头像组件
import commentImageVue from '../../components/commentImage.vue'//评论区图片组件
import { confirm } from '../../utils/Confirm' //确认框
import { colums } from './commentList'
import { ElMessage } from 'element-plus'
import {
  ReqauditComment,
  ReqdelComment,
  ReqloadComment,
  DATE,
  LoadComment,
  LISTObj,
} from '../../api/comment/index'
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any

//表单数据
const searchForm = ref({})
//批量操作数据
const selectBatchList = ref<any>([])
const SearchRef = ref() //搜索组件实例
const MyTableRef = ref() //表格组件实例
//表格数据
const tableData = ref<DATE>()
//表格属性
const options = ref({
  tabHeight: 670,
  extHeight: 0,
  stripe: true,
  border: false,
  showIndex: true,
  selectType: 'checkbox',
})
//获取文章收集参数
const paramsDate = (date: any) => {
  //整理参数
  const params: LoadComment = {
    pageNo: tableData.value?.pageNo,
    pageSize: tableData.value?.pageSize,
    contentFuzzy: date.contentFuzzy,
    nickNameFuzzy: date.nickNameFuzzy,
    status: date.status,
  }
  return params
}
//获取评论列表
const getCommentList = async () => {
  try {
    const date = paramsDate(searchForm.value)
    const res = await ReqloadComment(date)
    if (res.code === 200) {
      tableData.value = res.data
    }
  } catch (error) {
    console.log('获取评论列表失败')
    throw error
  }
}
//重置按钮
const resetClick = () => {
  nextTick(async () => {
    Object.keys(searchForm.value).forEach((it: any) => {
      //@ts-ignore
      searchForm.value[it] = ''
    })
    await getCommentList()
  })
}
//批量审批按钮
const auditBatch = () => {
  try {
    confirm('确定要批量审核吗？', async () => {
      //参数结构为接口所需数据 数组->字符串
      const commentIds=selectBatchList.value.join(',')
      const res = await ReqauditComment(commentIds)
      if (!res) return
      //调用子组件方法清空所有选中
      MyTableRef.value.clearSelection()
      getCommentList()
      ElMessage.success('批量审核成功')
    })
  } catch (error) {
    ElMessage.error('批量审核失败')
    throw error
  }
}
//批量删除按钮
const deleteBatch = () => {
  try {
    confirm('确定要批量删除吗？', async () => {
      //参数结构为接口所需数据 数组->字符串
      const commentIds=selectBatchList.value.join(',')
      const res = await ReqdelComment(commentIds)
      if (!res) return
      //调用子组件方法清空所有选中
      MyTableRef.value.clearSelection()
      getCommentList()
      ElMessage.success('批量删除成功')
    })
  } catch (error) {
    ElMessage.error('批量删除失败')
    throw error
  }
}
//删除按钮
const deleteComment = (row: LISTObj) => {
  try {
    confirm('确定要删除吗？', async () => {
      const res = await ReqdelComment(row.commentId)
      if (!res) return
      getCommentList()
      ElMessage.success('删除成功')
    })
  } catch (error) {
    ElMessage.error('删除失败')
    throw error
  }
}
//审核按钮
const auditComment = (row: LISTObj) => {
  try {
    confirm('确定要审核吗？', async () => {
      const res = await ReqauditComment(row.commentId)
      if (!res) return
      getCommentList()
      ElMessage.success('审核成功')
    })
  } catch (error) {
    ElMessage.error('审核失败')
    throw error
  }
}
//行多选 收集多选数据
const SetCurrentRow = (rows: any) => {
  selectBatchList.value = []
  rows.forEach((item: any) => {
    //添加选中
    selectBatchList.value.push(item.commentId)
  })
}
onMounted(() => {
  getCommentList()
})
</script>

<style scoped lang="scss">
.list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 10px;
      color: #715b5b;
    }
  }
}
.iconfont {
  cursor: pointer;
}
</style>
