<template>
  <div :style="{ width: '800px' }">
    <el-form :model="formDate" :rules="rules" ref="formRef">
      <el-divider content-position="left">用户注册欢迎消息</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="欢迎消息：" prop="registerWelcomInfo">
            <el-input
              v-model="formDate.registerWelcomInfo"
              placeholder="请输入欢迎信息"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">邮件设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮件标题:" prop="emailTitle">
            <el-input
              v-model="formDate.emailTitle"
              placeholder="请输入邮件标题"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮件内容:" prop="emailContent">
            <el-input
              v-model="formDate.emailContent"
              placeholder="请输入邮件内容，验证码使用%s占位符"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">审核设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="帖子是否需要审核:" prop="postAudit">
            <el-radio-group v-model="formDate.postAudit">
              <el-radio :label="false">无需审核</el-radio>
              <el-radio :label="true">需要审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论是否需要审核:" prop="commentAudit">
            <el-radio-group v-model="formDate.commentAudit">
              <el-radio :label="false">无需审核</el-radio>
              <el-radio :label="true">需要审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">发帖设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发帖积分:" prop="postIntegral">
            <el-input
              v-model="formDate.postIntegral"
              placeholder="请输入发帖可获得积分"
              type="number"
            />
          </el-form-item>
          <el-form-item label="明天可发帖数量:" prop="postDayCountThreshold">
            <el-input
              v-model="formDate.postDayCountThreshold"
              placeholder="请输入每天可发帖数量"
              type="number"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每天可上传图片数量:" prop="dayImageUploadCount">
            <el-input
              v-model="formDate.dayImageUploadCount"
              placeholder="请输入每天可上传图片数量"
              type="number"
            />
          </el-form-item>
          <el-form-item label="允许附件大小(MB):" prop="attachmentSize">
            <el-input
              v-model="formDate.attachmentSize"
              placeholder="请输入允许上传附件大小(MB):"
              type="number"
            >
              <template #append>MB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">评论设置</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否开启评论:" prop="commentOpen">
            <el-radio-group v-model="formDate.commentOpen">
              <el-radio :label="false">关闭</el-radio>
              <el-radio :label="true">开启</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="评论积分:" prop="commentIntegral">
            <el-input
              v-model="formDate.commentIntegral"
              placeholder="请输入评论可获得积分"
              type="number"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="每天可发评论数量:"
            prop="commentDayCountThreshold"
          >
            <el-input
              v-model="formDate.commentDayCountThreshold"
              placeholder="请输入每天可发评论数量"
              type="number"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">点赞设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="每天可点赞数量:" prop="likeDayCountThreshold">
            <el-input
              v-model="formDate.likeDayCountThreshold"
              placeholder="请输入每天可点赞数量"
              type="number"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="sendClick">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  saveSetting,
  ReqgetSetting,
  ReqsaveSetting,
} from '../../api/settings/index'
import { rules } from './rules'
import { ElForm, ElMessage } from 'element-plus'
import { MyRef } from '../../utils/userCompRef'
//表单数据
const formDate = ref<saveSetting>({
  registerWelcomInfo: '',
  emailTitle: '',
  emailContent: '',
  postAudit: false,
  commentAudit: false,
  postIntegral: 0,
  dayImageUploadCount: 0,
  postDayCountThreshold: 0,
  attachmentSize: 0,
  commentOpen: false,
  commentIntegral: 0,
  commentDayCountThreshold: 0,
  likeDayCountThreshold: 0,
})
const formRef = MyRef(ElForm)
//保存按钮
const sendClick = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    const res = await ReqsaveSetting(formDate.value)
    if (res.code === 200 || res.code === 500) {
      ElMessage.success('保存成功')
      getSttings()
    }else{
      ElMessage.error('保存失败')
      throw new Error('保存失败')
    }
  })
}
//获取系统设置
const getSttings = async () => {
  try {
    const res = await ReqgetSetting()
    if (!res) return
    const resDate: any = res.data
    for (const key in resDate) {
      const keyDate: any = resDate[key]
      if (keyDate != null) {
        for (const sub in keyDate) {
          //@ts-ignore
          formDate.value[sub] = keyDate[sub]
        }
      }
    }
  } catch (error) {
    throw error
  }
}
onMounted(() => {
  getSttings()
})
</script>

<style scoped></style>
