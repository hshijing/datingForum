<!-- 弹出框 -->
<template>
  <el-dialog
      :model-value="show"
      :show-close="showClose"
      :draggable="true"
      :close-on-click-modal="false"
      class="cust-dialog"
      :title=titel
      :width="width"
      top="100px"
      @close="close"
      >
      <div class="login-body">
        <slot></slot>
      </div>
      <template v-if="buttons&&buttons.length>0">
        <div class="footer">
          <el-button @click="close" v-if="showBtnClose">
            取消
          </el-button>
          <el-button v-for="(btn, index) in buttons" :key="index"
            :type="btn.type" @click="btn.click">{{ btn.text }}
          </el-button>
        </div>
      </template>
  </el-dialog>
</template>

<script setup lang='js'>
defineProps({
  show:{
    type:Boolean,
    default:false,
  },
  titel:{
    type:String,
    default:'标题'
  },
  showClose:{
    type:Boolean,
    default:true,
  },
  buttons:{
    type:Array
  },
  width:{
    type:String,
    default:300,
  },
  showBtnClose:{
    type:Boolean,
    default:true,
  }
})
const emit=defineEmits()
const close=()=>{
  emit('close')
}
</script>

<style scoped lang="scss"> 
.cust-dialog{
  .el-dialog__body{
    padding: 0px;
  }
  .login-body{
    border-bottom: 1px solid #eee;
    min-height: 100px;
    max-height: calc(100vh - 300px);
    overflow: auto;
  }
  .footer{
    text-align: right;
    padding: 10px 20px;
  }
}

</style>