<!-- 用户中心 ->文章相关 -->
<template>
  <div class="panel">
    <!-- 标签栏 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange">
      <el-tab-pane label="发帖" :name="0"></el-tab-pane>
      <el-tab-pane label="评论" :name="1"></el-tab-pane>
      <el-tab-pane label="点赞" :name="2"></el-tab-pane>
          <!-- 内容列表 -->
    <div class="list">
      <dateListVue
        :dateSource="dateList"
        :_loding="loding"
        @locatDate="locatDateChange"
        :dateListMsg="`暂未相关文章`"
      >
        <template #default="{date}">
          <AticleItemVue :date="date" 
          :showEdit="activeName==0&&currId===userId"
          />
        </template>
      </dateListVue>
    </div>
    </el-tabs>
  </div>
</template>

<script setup lang='js'>
import dateListVue from '@/components/dateList.vue';
import AticleItemVue from '@/views/forum/AticleItem.vue';
import {ReqloadUserArticle} from '@/api/usernter';
import { ref, onMounted ,watch} from 'vue';
import {useRoute} from 'vue-router';
import { store } from '@/vuex';
const route=useRoute()
const activeName=ref(0)//当前标签高亮
const dateList=ref({})//接收内容列表
const loding=ref(false)//骨架屏
const pageNo=ref(1)//当前页码
const currId=ref(undefined)//登录用户id
const userId=ref(undefined)//文章发布者id
//获取用户发帖
const getUserArticle=async()=>{
  try {
    loding.value=true
    const res=await
      ReqloadUserArticle(activeName.value,userId.value,pageNo.value,)
    if(res.code==200){
      dateList.value=res.data
      loding.value=false
    }
  } catch (error) {
    loding.value=false
    return Promise.reject('获取失败',error)
  }
}
//标签变化
const tabChange=(type)=>{
  activeName.value=type
  getUserArticle()
}
//分页器变化
const locatDateChange=(page)=>{
  pageNo.value=page
  getUserArticle()
}
onMounted(()=>{
  userId.value=route.params.userId
  getUserArticle()
})
//监听查看id  实时更新文章
watch(
  ()=>route.params.userId,
  (newVal,oldVal)=>{
    if(newVal!=null&&newVal!=oldVal){
      userId.value=route.params.userId;
      getUserArticle()
    }
  }
)
//监听当前用户登录的id  实时更新是否显示编辑
watch(
  ()=>store.state.loginUserInfo,
  (newVal)=>{
    if(newVal!==null){
      currId.value=newVal.userId
    }
  },
  {immediate:true,deep:true}
)
</script>

<style scoped lang="scss">
.panel{
  width: 100%;
  .demo-tabs{
    width: 100%;
  }
}
</style>