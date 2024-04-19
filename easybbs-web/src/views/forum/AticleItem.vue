<template>
  <div class="aticle-item">
    <div class="aticle-item-inner">
      <div class="article-body">
        <!-- 头部栏信息 -->
        <div class="user-info">
          <!-- 头像 -->
          <userInfo
            :userId="date.userId"
            :width="40"
            :LEFT="`0px`"
            :TOP="`0px`"
          />
          <!-- 账号昵称 -->
          <router-link :to="`/user/${date.userId}`" class="routerlink">
            {{ date.nickName }}
          </router-link>
          <span class="span">|</span>
          <!-- 发布日期 -->
          <div class="post-time">{{ date.postTime }}</div>
          <!-- 发布IP -->
          <span class="address">&nbsp;·&nbsp;{{ date.userIpAddress }}</span>
          <span class="span">|</span>
          <!-- 发布板块 ->一级 -->
          <router-link class="routerlink" :to="`/forum/${date.pBoardId}`">
            {{ date.pBoardName }}
          </router-link>
          <!-- 发布板块 ->二级 -->
          <template v-if="date.boardName">
            <span class="span">/</span>
            <router-link
              class="routerlink"
              :to="`/forum/${date.pBoardId}/${date.boardId}`"
            >
              {{ date.boardName }}
            </router-link>
          </template>
        </div>
        <!-- 主体内容 -->
        <div class="content">
          <!-- 标题  -->
          <router-link class="title" :to="`/post/${date.articleId}`">
            <span v-if="date.status == 0" class="tag no-adim">待审核</span>
            <span v-if="date.topType === 1" class="top">置顶</span>
            <span
              v-if="showTitle"
              @click="getaticleDateClick(date)"
              v-html="date.title"
            ></span>
            <span v-else @click="getaticleDateClick(date)">{{
              date.title
            }}</span>
          </router-link>
          <!-- 内容摘要 -->
          <p class="summary">{{ date.summary }}</p>
          <!-- 阅读 点赞 评论-->
          <div class="article-info">
            <span class="iconfont icon-eye-solid">
              {{ date.readCount == 0 ? '阅读' : date.readCount }}
            </span>
            <span class="iconfont icon-good">
              {{ date.goodCount == 0 ? '点赞' : date.goodCount }}
            </span>
            <span class="iconfont icon-comment" v-if="showComment">
              {{ date.commentCount == 0 ? '评论' : date.commentCount }}
            </span>
            <span
              class="iconfont icon-edit"
              v-if="showEdit"
              @click="editArticle(date.articleId)"
            >
              编辑
            </span>
          </div>
        </div>
      </div>
      <!-- 文章封面图片 -->
      <router-link :to="`/post/${date.articleId}`">
        <Cover v-if="date.cover" :cover="date.cover" :width="100" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="js">
import userInfo from '@/components/userInfo.vue';
import Cover from './Cover.vue';
import { store } from '@/vuex';
import {ref,watch} from 'vue';
import {useRouter} from 'vue-router';
defineProps({
  date:{
    type:Object,
  },
  showEdit:{
    type:Boolean,
    default:false
  },
  showTitle:{
    type:Boolean,
    default:false
  }
})
const router=useRouter()
//是否打开评论
const showComment=ref(false)
//点击昵称
const getaticleDateClick=async(date)=>{
  store.commit('ArticleListInfo',date.articleId)
}
//编辑按钮
const editArticle=(id)=>{
  router.push(`/editPost/${id}`)
}
watch(
  ()=>store.state.commentOpen,
  (newVal)=>{
    if(newVal){
      showComment.value=newVal
    }
  },
  {immediate:true,deep:true}
)
</script>

<style scoped lang="scss">
.aticle-item {
  padding: 5px 10px;
  border-bottom: 1px solid #ddd;
  .aticle-item-inner {
    padding: 10px;
    display: flex;
    .article-body {
      box-sizing: border-box;
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        .routerlink {
          text-decoration: none;
          color: #595656;
          margin-left: 5px;
        }
        .routerlink:hover {
          cursor: pointer;
          color: #197fd8;
        }
        .post-time {
          font-size: 13px;
        }
      }
      .span {
        margin: 10px;
        color: #acaaaa;
      }
      .title {
        font-weight: bold;
        text-decoration: none;
        color: #464545;
        font-size: 16px;
        margin: 10px 0;
        display: inline-block;
        .tag {
          font-size: 12px;
          border-radius: 3px;
          padding: 0px 5px;
          margin-right: 5px;
          font-weight: normal;
        }
        .no-adim {
          color: #a4a4a4;
          border: 1px solid #a4a4a4;
        }
        .top {
          font-weight: normal;
          font-size: 12px;
          border-radius: 5px;
          border: 1px solid #f54b4b;
          color: #f54b4b;
          padding: 2px 2px;
          margin-right: 5px;
        }
      }
      .summary {
        margin-top: 5px;
        font-size: 14px;
        color: #86909c;
      }
      .article-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 13px;
        .iconfont {
          color: #86909c;
          margin-right: 25px;
          font-size: 14px;
          cursor: pointer;
        }
        .iconfont::before {
          padding-right: 5px;
        }
        .icon-edit {
          color: #197fd8;
        }
      }
    }
  }
}
.aticle-item:hover {
  background-color: #f5f5f5;
}
</style>
