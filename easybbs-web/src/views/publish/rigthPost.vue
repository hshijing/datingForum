<template>
  <div class="post-setting">
    <el-card>
      <template #header>
        <span>设置</span>
      </template>
      <div class="stting-inner">
        <el-form-item label="标题：" prop="title">
          <el-input
            v-model="_props.date.title"
            placeholder="请输入文章标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类：" prop="boardIds">
          <el-cascader
            placeholder="请选择分类"
            :options="boardList"
            :props="boardProps"
            v-model="_props.date.boardIds"
            :style="{ width: '100%' }"
          />
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <FormCoverVue v-model="_props.date.cover" />
        </el-form-item>
        <el-form-item label="摘要：" prop="summary">
          <el-input
            clearable
            type="textarea"
            :rows="3"
            :maxlength="500"
            resize="none"
            show-word-limit
            v-model="_props.date.summary"
          />
        </el-form-item>
        <el-form-item label="附件：" prop="file">
          <FormAnnexVue v-model="_props.date.attachment" />
        </el-form-item>
        <el-form-item
          label="积分："
          prop="integral"
          v-if="_props.date.attachment"
        >
          <el-input
            placeholder="请输入下载附件所需积分"
            v-model="_props.date.integral"
            type="number"
          />
          <span class="integral">下载附件&nbsp;&nbsp;所需积分</span>
        </el-form-item>
        <!-- 保存按钮 -->
        <el-form-item>
          <button class="button" type="button" @click="sendClick">
            <svg
              class="svgIcon"
              viewBox="0 0 512 512"
              height="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
              ></path>
            </svg>
            保存
          </button>
        </el-form-item>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="js">
import FormCoverVue from './FormCover.vue';//封面组件
import FormAnnexVue from './FormAnnex.vue';//附件组件
import {ReqloadBoard4Post,ReqArticle} from '@/api/publish';
import {reactive,onMounted} from 'vue';
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
const router=useRouter();
const _props=defineProps({
  date: Object,//表单数据
  formRef:Object,//表单实例
})
//接收分类信息
const boardList=reactive([])
//板块映射
const boardProps={
  multiple:false, //是否多选
  checkStrictly:true, //是否严格的遵守父子节点不互相关联
  value:'boardId', //指定选项的值为选项对象的某个属性值
  label:'boardName', //指定选项标签为选项对象的某个属性值
}
//获取发布板块信息
const getloadBoard=async()=>{
  const res=await ReqloadBoard4Post()
  if(res&&res.code===200){
    boardList.push(...res.data)
  }
}
//点击保存按钮时收集接口参数
const gatherParams = () =>
{
  const {
    articleId,
    cover,
    integral,
    title,
    summary,
    attachment,
    boardIds,
    content,//内容
  }
    = _props.date
  const pBoardId = boardIds[0]//父级板块ID
  const boardId = boardIds[1]//板块ID
  //内容  富文本->纯文本 干掉处理img标签外的所有标签
  const processedContent = content.replace(/<(?!img).*?>/g, '')
  //妈的样式出问题了 只能自己拼接一个
  const regex = /(<img.*?style=")(.*?)(".*?>)/g;
  const replacedHTML = content.replace(regex, `$1$2 max-width: 1000px;$3`);
  //内容不能为空
  if (processedContent === '') {
    ElMessage.warning('正文必须输入内容')
    return;
  }
  //是否有附件 0->没有   1->有
  const attachmentType = attachment !== null ? 1 : 0
  //封面处理  上传的封面必须是文件
  const processedCover = cover instanceof File ? cover : null
  //附件处理处理  上传的附件必须是文件
  const Pattachment = attachment instanceof File ? attachment : null
  return {
    articleId,//文章Id 根据这个区分新增修改
    cover: processedCover,//封面，文件流
    integral,//附件下载所需积分
    pBoardId,//父级板块
    boardId,//当前板块
    title,//标题
    editorType: 0,//富文本编辑器
    summary,//简介
    attachment: Pattachment,//附件，文件流
    attachmentType,//是否有附件 0->没有   1->有
    content:replacedHTML,//内容
  };
}
//保存按钮
const sendClick=async()=>{
  try {
    await _props.formRef.validate()//表单校验
    const params=gatherParams()//收集参数
    const res= await ReqArticle(params)
    if(res.code===200){
      ElMessage.success(params.articleId?'修改成功':'发布成功')
      router.push(`/post/${res.data}`)
    }else{
      ElMessage.error(params.articleId?'修改失败':'发布失败')
      throw new Error(res.info)
    }
  } catch (error) {
    return Promise.reject('文章发布失败',error)
  }
}
onMounted(()=>{
  getloadBoard()
})
</script>

<style scoped lang="scss">
.post-setting {
  width: 450px;
  margin-left: 10px;
  :deep(.el-card .el-card__header) {
    padding: 10px;
  }
  .stting-inner {
    max-height: calc(100vh - 120px);
    overflow: auto;
    .integral {
      font-size: 12px;
      color: #8c8c8d;
    }
  }
  .button {
    width: 310px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 400;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    gap: 10px;
    border-radius: 30px;
    color: rgb(19, 19, 19);
    border: none;
    position: relative;
    left: 50px;
    cursor: pointer;
    transition-duration: 0.2s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.116);
    padding-left: 8px;
    transition-duration: 0.5s;
  }

  .svgIcon {
    height: 35px;
    transition-duration: 1.5s;
  }

  .bell path {
    fill: rgb(46, 45, 45);
  }

  .button:hover {
    background-color: #a9a9ab;
    transition-duration: 0.5s;
  }

  .button:active {
    transform: scale(0.97);
    transition-duration: 0.2s;
  }

  .button:hover .svgIcon {
    transform: rotate(250deg);
    transition-duration: 1.5s;
  }
}
</style>
