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
      <el-form :model="formDate" ref="formRef" :rules="rules">
        <el-form-item label="消息内容" prop="message">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入发送消息内容"
            :maxlength="200"
            resize="none"
            show-word-limit
            v-model="formDate.message"
          />
        </el-form-item>
        <el-form-item label="积分">
          <el-input
            type="number"
            placeholder="积分为空或0积分不变,负数为减少积分"
            v-model="formDate.integral"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendClick">确定</el-button>
        </el-form-item>
      </el-form>
    </MydilongVue>
  </div>
</template>

<script setup lang="ts">
import MydilongVue from '../../components/Mydilong.vue' //弹窗组件
import { MyRef } from '../../utils/userCompRef' //自定义ref
import { ref, nextTick } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { ReqsendMessage, LISTObj } from '../../api/user'
const emit = defineEmits(['sendClick'])
//表单数据
const formDate = ref<any>({})
//表单实例
const formRef = MyRef(ElForm)
//弹出框数据
const DilongDate = ref({
  show: false,
  showClose: true,
  titel: '发送消息',
})
const rules = {
  message: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
}
const sendClick = () => {
  try {
    formRef.value?.validate(async (valid) => {
      if (!valid) return
      const date = Object.assign({}, formDate.value)
      const res = await ReqsendMessage(date)
      if (res.code === 200) {
        DilongDate.value.show = false
        ElMessage.success('发送成功')
        emit('sendClick')
      }
    })
  } catch (error) {
    DilongDate.value.show = false
    ElMessage.error('发送失败')
    throw error
  }
}
const sendMessage = (date: LISTObj) => {
  DilongDate.value.show = true
  nextTick(() => {
    formRef.value?.resetFields()
    formDate.value = {
      userId: date.userId,
      nickName: date.nickName,
    }
  })
}
defineExpose({ sendMessage })
</script>

<style scoped></style>
