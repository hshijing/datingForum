<template>
  <div>
    <MydilongVue
      :show="DilongDate.show"
      :show-close="DilongDate.showClose"
      :titel="DilongDate.titel"
      width="700px"
      top="100px"
      @close="DilongDate.show = false"
    >
      <div class="list">
        <div class="item" v-for="item in commentList" :key="item.articleId">
          <div class="item-p">
            <!-- 头像 -->
            <userInfoVue :user-id="item.userId" :width="40" />
            <div class="content-info">
              <!-- 昵称 -->
              <a
                target="_blank"
                class="a-link"
                :href="`${proxy.globalInfo.webUrl}user/${item.userId}`"
              >
                {{ item.nickName }}
              </a>
              <!-- 内容 -->
              <div v-html="item.content" class="content"></div>
              <!-- 是否有图片内容 -->
              <div v-if="item.imgPath">
                <commentImageVue
                  :src="proxy.globalInfo.imageUrl+item.imgPath.replace('.', '_.')"
                  :img-list="[proxy.globalInfo.imageUrl + item.imgPath]"
                />
              </div>
              <!-- 互动信息 -->
              <div class="post-info">
                发布:{{ item.postTime }}&nbsp;·&nbsp;
                {{ item.userIpAddress }}&nbsp;&nbsp; 赞{{ item.goodCount }}
              </div>
              <!-- 子集信息 -->
              <template v-if="item.children">
                <div
                  class="s-comment"
                  v-for="child in item.children"
                  :key="child.articleId"
                >
                  <!-- 头像 -->
                  <userInfoVue :user-id="child.userId" :width="40" />
                  <div class="content-info">
                    <!-- 昵称 -->
                    <a
                      target="_blank"
                      class="a-link"
                      :href="`${proxy.globalInfo.webUrl}user/${child.userId}`"
                    >
                      {{ child.nickName }}
                    </a>
                    <!-- 回复对象 -->
                    <span v-if="child.replyUserId">
                      回复：<a
                        target="_blank"
                        class="a-link"
                        :href="`${proxy.globalInfo.webUrl}user/
                      ${child.replyUserId}`"
                      >
                        {{ child.replyNickName }}
                      </a>
                    </span>
                  </div>
                  <!-- 回复内容 -->
                  <div v-html="child.content" class="content"></div>
                  <!-- 互动信息 -->
                  <div class="post-info">
                    发布:{{ child.postTime }}&nbsp;·&nbsp;
                    {{ child.userIpAddress }}&nbsp;&nbsp; 赞{{
                      child.goodCount
                    }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList?.length == 0">暂无评论</div>
    </MydilongVue>
  </div>
</template>

<script setup lang="ts">
interface DILONG {
  show: boolean
  showClose: boolean
  titel: string
}
import userInfoVue from '../../../components/userInfo.vue' //头像组件
import MydilongVue from '../../../components/Mydilong.vue'//弹窗组件
import commentImageVue from '../../../components/commentImage.vue'//评论照片组件
import { ReqloadComment4Article, list } from '../../../api/article/index'
import { ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() as any
//弹出框数据
const DilongDate = ref<DILONG>({
  show: false,
  showClose: true,
  titel: '查看评论',
})
//评论列表
const commentList = ref<list>()
const show = async (row: any) => {
  try {
    const params = {
      pageNo: 1,
      pageSize: 15,
      articleId: row.articleId,
    }
    const res: any = await ReqloadComment4Article(params)
    if (res.code == 200) {
      DilongDate.value.show = true
      commentList.value = res.data
    }
  } catch (error) {
    ElMessage.error('文章已删除 查看失败')
    throw error
  }
}
defineExpose({ show })
</script>
<style lang="scss">
.list {
  .item {
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
    padding: 10px 0px;
    .item-p {
      display: flex;
    }
    .content-info {
      margin-left: 5px;
    }
    .post-info {
      font-size: 12px;
      color: #afafaf;
    }
    .s-comment {
      display: flex;
      margin-top: 10px;
    }
  }
}
</style>
