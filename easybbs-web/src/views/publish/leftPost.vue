<template>
  <div class="post-editor">
    <el-form-item prop="content">
      <el-card>
        <template #header>
          <span>正文</span>
        </template>
        <editorHTML
          :ModelValue="_props.date.content"
          :height="690"
          :showEdit="_props.showEdit"
          @update:ModelValue="updateContent"
        />
      </el-card>
    </el-form-item>
  </div>
</template>

<script setup lang="js">
const _props = defineProps({
  date: Object,//表单数据
  showEdit: Boolean,//新增文章
})
const updateContent = (html) =>{
  _props.date.content = html
}
</script>

<style scoped lang="scss">
.post-editor {
  flex: 1;

  :deep(.el-card .el-card__header) {
    padding: 10px;
  }
}
</style>
