<!-- 文章列表 -->
<template>
  <div
    class="container-body article-list-body"
    :style="{ width: `${proxy.globalInfo.herderWidth}px` }"
  >
    <!-- 二级导航栏 -->
    <div class="sub-board" v-if="pageNoInfo.pBoardId">
      <!-- 动态添加高亮 -->
      <span :class="['board-item', pageNoInfo.boardId == 0 ? 'active' : '']">
        <router-link :to="`/forum/${pageNoInfo.pBoardId}`">全部</router-link>
      </span>
      <span
        v-for="item in subBoardList"
        :key="item.boardId"
        :class="[
          'board-item',
          pageNoInfo.boardId == item.boardId ? 'active' : '',
        ]"
      >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">
          {{ item.boardName }}
        </router-link>
      </span>
    </div>
    <div class="article-panel">
      <!-- 标签栏 -->
      <div class="top-tab">
        <!-- 热榜 -->
        <div
          :class="['tab', pageNoInfo.orderType === 0 ? 'active' : '']"
          @click="chnagTpye(0)"
        >
          热榜
        </div>
        <span>|</span>
        <!-- 发布时间 -->
        <div
          :class="['tab', pageNoInfo.orderType === 1 ? 'active' : '']"
          @click="chnagTpye(1)"
        >
          发布时间
        </div>
        <span>|</span>
        <!-- 最新 -->
        <div
          :class="['tab', pageNoInfo.orderType === 2 ? 'active' : '']"
          @click="chnagTpye(2)"
        >
          最新
        </div>
      </div>
      <!-- 文章列表 -->
      <div class="article-list">
        <dateList
          :dateSource="articleListInfo"
          :_loding="_loding"
          @locatDate="updatePageNo"
          :dateListMsg="`暂未发现文章`"
        >
          <template #default="{ date }">
            <AticleItem :date="date" />
          </template>
        </dateList>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { getCurrentInstance, ref, onMounted,watch} from 'vue';
import AticleItem from './AticleItem.vue';//每个文章的组件
import dateList from '@/components/dateList.vue';//分页器
import {ReqGetloadArticle} from '@/api/artcle';
import {useRoute} from 'vue-router';
import { store } from '@/vuex';
const route=useRoute()
const {proxy}=getCurrentInstance()
//存储文章列表的数据
const articleListInfo=ref({})
//是否显示骨架 数据未响应 显示  数据已返回  关闭
const _loding=ref(false)
 //发送获取文章列表数据需要携带的参数
const pageNoInfo=ref({
  pageNo:1,//当前页
  pBoardId:0,//一级板块id
  boardId:0,//二级板块id
  orderType:0,//当前获取文章的类型 0->热榜   1->发布时间   2->最新
})
//点击分页器的上|下一页 修改当前页码
const updatePageNo=(pageNO)=>{
  pageNoInfo.value.pageNo=pageNO
  getArticleListInfo(pageNoInfo.value)
}
//发送请求获取文章列表
const getArticleListInfo=async(date)=>{
  _loding.value=true//打开骨架屏
  const res= await ReqGetloadArticle(date)
  if(res.code==200){
    articleListInfo.value=res.data//接收数据
    _loding.value=false//关闭骨架屏
  }
}
//更改当前文章排序 热门|发布时间|最新
const chnagTpye=(type)=>{
  //更新后的排序id
  pageNoInfo.value.orderType=type
  getArticleListInfo(pageNoInfo.value)
}
//接收二级板块消息
const subBoardList=ref([])
//点击跳转对应板块
const setSbuBoard=()=>{
  subBoardList.value= store.getters.getSubPlateList(pageNoInfo.value.pBoardId)
}
onMounted(()=>{
  getArticleListInfo(pageNoInfo.value)
})
//监听路由变化
watch(
  ()=>route.params,
  (newValue)=>{
    //更新板块一级id
    pageNoInfo.value.pBoardId=newValue.pBoardId
    //更新板块二级id
    pageNoInfo.value.boardId=newValue.boardId||0
    //跳转对应二级页面
    setSbuBoard()
    //获取文章列表数据
    getArticleListInfo(pageNoInfo.value)
    //更新仓库的一级id 用于标签高亮
    store.commit('setAcivePboardId',newValue.pBoardId)
    //更新仓库的二级id
    store.commit('setAciveboarId',newValue.boardId)
  },
  {immediate:true,deep:true}
)
</script>
<style scoped lang="scss">
.article-list-body {
  .sub-board {
    padding: 5px 0 10px 0;
    .board-item {
      background: #fff;
      border-radius: 15px;
      padding: 2px 10px;
      margin-right: 10px;
      color: #909090;
      cursor: pointer;
      font-size: 14px;
      a {
        text-decoration: none;
        color: #909090;
      }
    }
    .active {
      background: #72c7eb;
      a {
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
.article-panel {
  background: #fff;
}
.top-tab {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 15px;
  border-bottom: 1px solid #ddd;
  .tab {
    cursor: pointer;
  }
  .active {
    color: #0e94ce;
    font-size: 20px;
  }
  span {
    margin: 0 8px;
  }
}
</style>
