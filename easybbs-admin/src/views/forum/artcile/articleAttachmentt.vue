<template>
  <div>
    <MydilongVue
      :show="DilongDate.show"
      :show-close="DilongDate.showClose"
      :titel="DilongDate.titel"
      width="400px"
      top="200px"
      @close="DilongDate.show = false"
    >
      <el-form :model="formDate" ref="formRef" class="form">
        <!-- 发布人 -->
        <el-form-item label="发布人：">
          <userInfoVue :userId="formDate?.userId" />
          <span :style="{ marginLeft: '5px' }">{{ formDate?.nickName }}</span>
        </el-form-item>
        <!-- 文件名 -->
        <el-form-item label="文件名：">
          <span>{{ formDate?.fileName }}</span>
        </el-form-item>
        <el-form-item label="文件大小：">
          <span>{{ fileSize }}</span>
        </el-form-item>
        <el-form-item label="下载所需积分：">
          <span>{{ formDate?.integral }}</span>
        </el-form-item>
        <el-form-item>
          <a
            target="_blank"
            class="a-link"
            :href="`/api/forum/attachmentDownload?fileId=${formDate?.fileId}`"
          >
            下载
          </a>
        </el-form-item>
      </el-form>
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
import { MyRef } from '../../../utils/userCompRef'//自定义ref
import { _convertSize } from '../../../utils/fileSizeConversion'//单位转换
import { ElForm, ElMessage } from 'element-plus';
import { loadArticleList,ReqgetAttachment } from '../../../api/article/index'
import { ref } from 'vue'
const formRef = MyRef(ElForm) //表单实例
//表单数据
const formDate = ref<loadArticleList>()
//单位转换后的文件大小
const fileSize =ref()
//弹出框数据
const DilongDate = ref<DILONG>({
  show: false,
  showClose: true,
  titel: '查看附件',
})
//暴露给父组件
const show=async(row:loadArticleList)=>{
  try {
    const res:any=await ReqgetAttachment(row.articleId)
    if(res.code==200){
      DilongDate.value.show=true
      //数据回显
      formDate.value=Object.assign(row,res.data)
      //转换文件单位
      fileSize.value= _convertSize(formDate.value?.fileSize!)
    }
  } catch (error) {
    ElMessage.error('文章已删除 查看失败')
    throw error
  }
}
defineExpose({show})
</script>

