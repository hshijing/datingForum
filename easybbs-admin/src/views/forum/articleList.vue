<template>
  <div class="date-list">
    <!-- 搜索框 -->
    <SearchfoVue
      :showTitle="true"
      :searchForm="searchForm"
      :selectBatchList="selectBatchList"
      :boardList="boardList"
      :boardProps="boardProps"
      @searchClick="getActicle"
      @resetSearchClick="resetSearch"
      @auditBatchClick="auditBatch"
      @deleteBatchClick="deleteBatch"
      ref="SearchfoRef"
    />
    <!-- 表格数据 -->
    <MyTableVue
      v-if="tableData"
      :columns="colums"
      ref="MyTableRef"
      :tableData="tableData"
      :fetch="getActicle"
      :tabHeight="100"
      :options="(options as any)"
      @rowSetCurrentRow="SetCurrentRow"
      :showPagination="true"
    >
      <!-- 用户信息 -->
      <template #UserInfo="{ row }: { row: ArticleObj }">
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
      <!-- 文章封面-->
      <template #cover="{ row }: { row: ArticleObj }">
        <CoverVue :cover="row.cover" />
      </template>
      <!-- 标题 -->
      <template #titleInfo="{ row }: { row: ArticleObj }">
        <a
          class="a-link"
          :href="`${proxy.globalInfo.webUrl}post/${row.articleId}`"
          target="_blank"
          >{{ row.title }}
        </a>
      </template>
      <!-- 板块 -->
      <template #boardInfo="{ row }: { row: ArticleObj }">
        <div>
          <span>{{ row.pBoardName }}</span>
          <span v-if="row.boardName">&nbsp;/&nbsp;{{ row.boardName }}</span>
        </div>
      </template>
      <!-- 互动信息 -->
      <template #interactionInfo="{ row }: { row: ArticleObj }">
        <div>阅读：{{ row.readCount }}</div>
        <div>点赞：{{ row.goodCount }}</div>
        <div>
          <span>评论：{{ row.commentCount }}</span>
          <span
            class="a-link"
            v-if="row.commentCount"
            @click="goToComment(row)"
            >查看</span
          >
        </div>
      </template>
      <!-- 附件信息 -->
      <template #attachmentInfo="{ row }: { row: ArticleObj }">
        <div v-if="row.attachmentType == 0">无附件</div>
        <div v-if="row.attachmentType == 1">
          <span
            class="a-link"
            @click="goToattachment(row)"
            >查看附件</span
          >
        </div>
      </template>
      <!-- 文章状态 -->
      <template #startInfo="{ row }: { row: ArticleObj }">
        <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
        <span v-if="row.status == 0" :style="{ color: '#715b5b' }">待审核</span>
        <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span
        ><br />
        <span v-if="row.topType == 0" :style="{ color: 'blue' }">未置顶</span>
        <span v-if="row.topType == 1" :style="{ color: 'red' }">已置顶</span>
      </template>
      <!-- 操作 -->
      <template #op="{ row }: { row: ArticleObj }">
        <!-- 未删除显示 -->
        <div class="op-btns" v-if="row.status != -1">
          <el-dropdown trigger="click">
            <span class="iconfont icon-more"></span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- 修改板块 -->
                <el-dropdown-item @click="updateBoard(row)">
                  修改板块
                </el-dropdown-item>
                <!-- 取消置顶 -->
                <el-dropdown-item
                  @click="topArtcile(row)"
                  v-if="row.topType == 1 && row.status == 1"
                >
                  取消置顶
                </el-dropdown-item>
                <!-- 置顶 -->
                <el-dropdown-item
                  @click="topArtcile(row)"
                  v-if="row.topType == 0 && row.status == 1"
                >
                  置顶
                </el-dropdown-item>
                <!-- 删除 -->
                <el-dropdown-item @click="deleteArtcile(row)">
                  删除
                </el-dropdown-item>
                <!-- 审核 -->
                <el-dropdown-item @click="audit(row)" v-if="row.status == 0">
                  审核
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </MyTableVue>
    <!-- 修改板块弹窗 -->
    <articleBoardVue ref="articleBoardRef" @reload="getActicle" />
    <!-- 查看附件弹窗 -->
    <articleAttachmenttVue ref="articleAttachmenttRef" @show="goToattachment"/>
    <!-- 查看评论弹窗 -->
    <articleCommentVue ref="articleCommentRef" @show="goToattachment"/>
  </div>
</template>

<script setup lang="ts">
import MyTableVue from '../../components/MyTable.vue' //表格组件
import userInfoVue from '../../components/userInfo.vue' //头像组件
import SearchfoVue from '../../components/Search.vue' //搜索组件
import CoverVue from '../../components/Cover.vue' //封面组件
import articleBoardVue from './artcile/articleBoard.vue' //板块弹窗组件
import articleAttachmenttVue from './artcile/articleAttachmentt.vue';//附件弹窗
import articleCommentVue from './artcile/articleComment.vue';//查看评论组件
import {
  ReqloadArticle, //获取文章
  ReqloadBoard, //获取板块
  loadBoardArr, //文章返回
  params, //文章携带参数类型
  Article, //单个文章类型
  ReqdelArticle, //删除文章
  ReqtopArticle, //置顶文章
  ReqauditArticle, //审核文章
} from '../../api/article'
import { colums, ArticleObj,Options } from './articleLIstDate' //数据
import { ref, getCurrentInstance, nextTick, onMounted } from 'vue'
import { confirm } from '../../utils/Confirm' //确认框
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() as any

const articleBoardRef = ref() //更新板块组件实例
const SearchfoRef = ref() //搜索组件实例
const MyTableRef = ref() //表格组件实例
const articleAttachmenttRef=ref()//附件弹窗实例
const articleCommentRef=ref()//查看评论组件实例
//搜索表单数据
const searchForm = ref({
  titleFuzzy: '',
  nickNameFuzzy: '',
  boardList: [],
  attachmentType: undefined,
  status: undefined,
  topType: undefined,
})
//文章列表
const tableData = ref<Article>()
//批量操作 ->收集勾选的行
const selectBatchList = ref<string[]>([])
//表单板块信息
const boardList = ref<loadBoardArr>()
//表单板块映射
const boardProps = ref({
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName',
})
//表格属性
const options = ref<Options>({
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
  const params: params = {
    pageNo: tableData.value?.pageNo,

    pageSize: tableData.value?.pageSize,

    titleFuzzy: date.titleFuzzy,

    nickNameFuzzy: date.nickNameFuzzy,

    attachmentType: date.attachmentType,

    status: date.status,

    pBoardId: date.boardList ? date.boardList[0] : undefined,

    boardId: date.boardList ? date.boardList[1] : undefined,

    topType: date.topType ? date.topType : undefined,
  }
  return params
}
//获取文章 ||搜索筛选获取文章
const getActicle = async () => {
  try {
    const date = paramsDate(searchForm.value)
    const res = await ReqloadArticle(date)
    if (res.code === 200) {
      tableData.value = res.data
    }
  } catch (error) {
    console.log('获取文章失败')
    throw error
  }
}
//获取板块信息
const getBoard = async () => {
  try {
    const res = await ReqloadBoard()
    if (!res) return
    boardList.value = res.data
  } catch (error) {
    console.log('板块获取失败')
    throw error
  }
}

//重置按钮 点击清空表单数据 发送请求
const resetSearch = () => {
  nextTick(async () => {
    Object.keys(searchForm.value).forEach((it: any) => {
      //@ts-ignore
      it == 'boardList'
        ? //@ts-ignore
          (searchForm.value[it] = [])
        : //@ts-ignore
          (searchForm.value[it] = undefined)
    })
    await getActicle()
  })
}
//查看附件详情 调用子组件方法
const goToattachment = (row:ArticleObj)=>articleAttachmenttRef.value.show(row)

//查看评论列表 调用子组件方法
const goToComment = (row:ArticleObj)=>articleCommentRef.value.show(row)

//修改板块 子组件方法
const updateBoard = (row: ArticleObj) => {
  articleBoardRef.value.updateBoardClick(row)
}
//批量审核按钮 子组件事件
const auditBatch = () => {
  confirm('确定要批量审核吗？', async () => {
    //参数结构为接口所需数据 数组->字符串
    const articleId = selectBatchList.value.join(',')
    const res = await ReqauditArticle(articleId)
    if (!res) return
    //调用子组件方法清空所有选中
    MyTableRef.value.clearSelection()
    resetSearch()
    ElMessage.success('批量审核成功')
  })
}
//批量删除按钮 子组件事件
const deleteBatch = () => {
  confirm('确定要批量删除吗？', async () => {
    const articleId = selectBatchList.value.join(',')
    const res = await ReqdelArticle(articleId)
    if (!res) return
    //调用子组件方法清空所有选中
    MyTableRef.value.clearSelection()
    ElMessage.success('批量删除成功')
    resetSearch()
  })
}
//行多选 收集多选数据
const SetCurrentRow = (rows: ArticleObj[]) => {
  selectBatchList.value = []
  rows.forEach((item) => {
    //添加选中
    selectBatchList.value.push(item.articleId)
  })
}
//置顶||取消置顶
const topArtcile = (row: ArticleObj) => {
  try {
    const optName = row.topType == 0 ? '设为置顶' : '取消置顶'
    confirm(`确定要将【${row.title}】${optName}?`, async () => {
      const res = await ReqtopArticle({
        articleId: row.articleId,
        topType: row.topType==0?1:0,
      })
      if (res.code == 200) {
        ElMessage.success(`${optName}成功`)
        getActicle()
      }
    })
  } catch (error) {
    ElMessage.error('操作失败')
    throw error
  }
}
//单个删除文章按钮
const deleteArtcile = (row: ArticleObj) => {
  try {
    confirm(`确定要删除【${row.title}】?`, async () => {
      const res = await ReqdelArticle(row.articleId)
      if (res.code == 200) {
        ElMessage.success(`删除成功`)
        getActicle()
      }
    })
  } catch (error) {
    ElMessage.error('删除失败')
    throw error
  }
}
//单个审核文章按钮
const audit = (row: ArticleObj) => {
  try {
    confirm(`确定要审核【${row.title}】?`, async () => {
      const res = await ReqauditArticle(row.articleId)
      if (res.code == 200) {
        ElMessage.success(`审核成功`)
        getActicle()
      }
    })
  } catch (error) {
    ElMessage.error('审核失败')
    throw error
  }
}

onMounted(() => {
  getBoard()
  getActicle()
})
</script>

<style scoped lang="scss">
.date-list {
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
