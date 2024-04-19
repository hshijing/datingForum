<template>
  <div class="edit-post">
    <el-form :model="formDate" class="post-panel" ref="formRef" :rules="rules">
      <!-- 左侧富文本输入 -->
        <leftPostVue :date="formDate" :showEdit="showEdit"/>
      <!-- 右侧发布信息收集 -->
        <rigthPostVue :date="formDate" :formRef="formRef"/>
    </el-form>
  </div>
</template>

<script setup lang="js">
import leftPostVue from './leftPost.vue';//左侧富文本输入
import rigthPostVue from './rigthPost.vue';//右侧发布信息收集
import {ref,watch,nextTick} from 'vue';
import {ReqarticleDetail4Update} from '@/api/publish';
import {useRoute} from 'vue-router';
const route=useRoute();
const formDate=ref({})//表单信息
const formRef=ref()//表单实例
const showEdit=ref(false)//新增文章
//表单校验
const rules={
  title:[
    {required:true,message:'请输入标题'},
    {min:1,max:50,message:'标题长度在1-50之间'}
  ],
  boardIds: [{ required: true, message: '请选择板块' }],
  content: [{ required: true, message: '请输入正文' }],
  summary: [{ required: true, message: '请输入摘要' }],
  integral: [{ required: true, message: '请输入下载所需积分' }],
}
//区分文章 修改 | 新增
const getArticle=()=>{
  nextTick(()=>{
    formRef.value.resetFields()
    if(formDate.value.articleId){
      getSssayVevise(formDate.value.articleId)//修改文章
    }else{
      formDate.value={}//新增文章
      showEdit.value=true
    }
  })
}
//修改文章获取详情
const getSssayVevise=async(id)=>{
  const res=await ReqarticleDetail4Update(id)
  if(res&&res.code==200){
    formDate.value=res.data.forumArticle//接收详细信息
    reviseEssayEcho(res.data.attachment)
  }
}
//修改文字详情信息回显
const reviseEssayEcho=(attachment)=>{
  //设置板块信息
  formDate.value.boardIds=[]
  formDate.value.boardIds.push(formDate.value.pBoardId)//父级板块
  if(formDate.value.boardId!=null&&formDate.value.boardId!=0)
    formDate.value.boardIds.push(formDate.value.boardId)//子级板块
  //设置封面信息
  if(formDate.value.cover){
    formDate.value.cover={imageUrl:formDate.value.cover}
  }
  //设置附件
  if(attachment){
    formDate.value.attachment={
      name:attachment.fileName
    }
  //设置下载所需积分
    formDate.value.integral=attachment.integral
  }
}
//监听路由变化 -> 区分文章修改或新增
watch(
  ()=>route,
  (newVal)=>{
    const isEdit=newVal.path.indexOf('/editPost')!=-1//修改
    const isNew=newVal.path.indexOf('/newpost')!=-1//新增
    if(isEdit||isNew){
      formDate.value.articleId=newVal.params.articleId//存储文章id
      getArticle()//对新增或者修改进行操作
    }
  },
  {deep:true,immediate:true}
)
</script>

<style scoped lang="scss">
.edit-post{
  .post-panel{
    display: flex;
  }
}
</style>
