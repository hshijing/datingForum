<!-- 发布文章表单附件组件 -->
<template>
  <div class="annex">
    <template v-if="props.modelValue">
      <div class="file-show">
        <div class="file-name" :title="props.modelValue.name">
          {{ props.modelValue.name }}
        </div>
        <div class="iconfont icon-del" @click="delFile"></div>
      </div>
    </template>
    <template  v-else>
      <el-upload
        name="file"
        :show-file-list="false"
        accept=".zip,.rar"
        :multiple="false"
        :http-request="sendFile"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    </template>
  </div>
</template>

<script setup lang="js">
//父组件传递
const props=defineProps({
  modelValue:{ //双向绑定
    type:Object,
    default:undefined
  }
})
//自定义事件
const emit=defineEmits()
//上传文件
const sendFile=async(file)=>emit('update:modelValue',file.file)
//删除选中文件
const delFile=()=>emit('update:modelValue',null)

</script>

<style scoped lang="scss">
.annex {
  .file-show {
    width: 100%;
    display: flex;
    .file-name {
      flex: 0 0 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #668edf;
    }
    .icon-del {
      width: 30px;
      cursor: pointer;
      color: #668edf;
      margin-left: 20px;
    }
  }
}
</style>
