<!-- 修改资料组件 -->
<template>
  <MydilongVue
    :show="dilongConfig.show"
    :titel="dilongConfig.titel"
    :show-close="true"
    @close="closeHanderl"
    width="400"
  >
    <el-form :model="formDate" :rules="rules" ref="rormRef">
      <el-form-item label="昵称" prop="nickName">
        <span>{{ formDate.nickName }}</span>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <FormCoverVue
          v-model="formDate.avatar"
          :imgUrl="proxy.globalInfo.avatrUserUrl"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formDate.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介" prop="personDescription">
        <el-input
          placeholder="请输入简介"
          type="textarea"
          :rows="3"
          resize="none"
          clearable
          show-word-limit
          v-model="formDate.personDescription"
        />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button
          :style="{ position: 'relative', left: 240 + 'px', width: 100 + 'px' }"
          type="primary"
          @click="edituserinfoClick"
          >修改
        </el-button>
      </el-form-item>
    </el-form>
  </MydilongVue>
</template>

<script setup lang="js">
import MydilongVue from '@/components/Mydilong.vue';
import FormCoverVue from '../publish/FormCover.vue';
import {ref,nextTick,getCurrentInstance} from 'vue';
import {useRouter} from 'vue-router';
import {RequpdateUserInfo} from '@/api/usernter';
const {proxy}=getCurrentInstance()
const router=useRouter()
//弹窗信息
const dilongConfig=ref({
  show:false,
  titel:'修改个人信息',
})
const emit=defineEmits()
const formDate=ref({})//表单内容数据
const rormRef=ref()//表单实例
//表单校验
const rules={
  nickName:[{ required: true, message: '昵称不能为空' }],
  sex:[{ required: true, message: '性别不能为空'}],
  personDescription:[{ required: true, message: '简介不能为空' }],
  avatar:[{ required: true, message: '头像不能为空'}],
}
//表单关闭按钮
const closeHanderl=()=>{
  dilongConfig.value.show=false
}
// 修改个人信息提交按钮
const edituserinfoClick=async()=>{
  //整理参数
  await rormRef.value.validate()
  const params = Object.assign({},formDate.value)
  const res=await RequpdateUserInfo(params)
  if(!res) return
    dilongConfig.value.show=false
    //用户修改信息是否修改头像？ 修改了需要重新获取到最新头像进行全页面更新
    if(params.avatar instanceof File){
      router.go(0);//简单暴力刷新页面
    }
    else{
      emit('flushedUserInfo',params)//数据回显更新页面
    }
  }
//暴露的函数 ->> 父组件点击编辑调用
const showEditDilong=(type,userInfo)=>{
  dilongConfig.value.show=type//父组件点击编辑按钮
  nextTick(()=>{
    rormRef.value.resetFields()//重置表单
    const date=JSON.parse(JSON.stringify(userInfo))
    date.avatar={
      imageUrl:date.userId
    }
    //数据回显
    formDate.value=date
  })
}
defineExpose({showEditDilong})
</script>

<style scoped></style>
