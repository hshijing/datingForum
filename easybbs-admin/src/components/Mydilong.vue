<!-- 弹出框 -->
<template>
  <el-dialog
    :model-value="show"
    :show-close="showClose"
    :draggable="true"
    :close-on-click-modal="false"
    class="cust-dialog"
    :title="titel"
    :width="width"
    :top="top"
    @close="close"
  >
    <div class="login-body">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps({
  show: {//是否显示 Dialog
    type: Boolean,
    default: false,
  },
  titel: {//对话框的标题
    type: String,
    default: '标题',
  },
  showClose: {//是否显示关闭按钮
    type: Boolean,
    default: true,
  },
  width: {//对话框的宽度
    type: String,
    default: 300,
  },
  top:{//对话框的top
    type:String,
    default: '200',
  }
})
const emit = defineEmits()
const close = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.cust-dialog {
  .el-dialog__body {
    padding: 0px;
  }
  .login-body {
    border-bottom: 1px solid #eee;
    min-height: 100px;
    max-height: calc(100vh - 300px);
    overflow: auto;
  }
  .footer {
    text-align: right;
    padding: 10px 20px;
  }
}
</style>
