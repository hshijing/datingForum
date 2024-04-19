<template>
  <div class="login">
    <div class="login-panel">
      <span class="login-title">登录</span>
      <el-form :model="formDate" ref="formRef" :rules="rules">
        <!-- 账号 -->
        <el-form-item prop="account">
          <el-input
            v-model="formDate.account"
            placeholder="请输入账号"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="formDate.password"
            placeholder="请输入密码"
            size="large"
            type="password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check">
            <el-input
              v-model="formDate.checkCode"
              placeholder="请输入验证码"
              size="large"
              class="input"
              @keyup.enter.prevent="submitForm"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl" class="checkImg" @click="changeClick">
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" :style="{width:'100%'}" @click="submitForm">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {MyRef} from '../utils/userCompRef';//获得组件实例函数
import {ElForm,ElMessage} from 'element-plus';//表单组件
import {ReqLogin,loginRes} from '../api/login/index';//登录请求
import {md5} from 'js-md5';
import VueCookies from 'vue-cookies';
import {useRouter} from 'vue-router';
const router=useRouter();//路由实例
//表单数据
const formDate = ref({
  account: "admin",//账号
  password: "000000",//密码
  checkCode: "",//验证码
});
//表单实例
const formRef = MyRef(ElForm);
//表单校验
const rules = {
  account: [{ required: true, message: "请输入账号", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }],
  checkCode: [{ required: true, message: "请输入验证码", trigger: "change" }],
};
//表单验证码图片
const checkCodeUrl=ref('/api/checkCode')
//获取验证码按钮
const changeClick=()=>{
  checkCodeUrl.value='/api/checkCode?time='+new Date().getTime()
}
//登录按钮
const submitForm=async()=>{
  try {
    await formRef.value?.validate()//表单校验
    const params=Object.assign({},formDate.value)
    params.password=md5(params.password)//整理参数
    const res:loginRes=await ReqLogin(params,changeClick)
    if(res.code===200){
      ElMessage.success('登录成功')
        router.push('/')//跳转到首页
      //@ts-ignore设置cookie
      VueCookies.set('userInfo',res.date,0)
    }
  } catch (error:any) {
    ElMessage.error(error.msg)
    return Promise.reject(error)
  }
}
</script>
<style scoped lang="scss">
.login{
  width: 100vw; // 使用vw单位确保整个视口宽度
  height: calc(100vh); // 使用vh单位确保整个视口高度
  background: url("../assets/img/login.jpg") no-repeat center center;
  background-size: cover;
  .login-panel{
    opacity: 0.9;
    margin-top: 230px;
    width: 350px;
    float: right;
    margin-right: 130px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 10px #c5c4c4;
    .login-title{
      position: relative;
      font-size: 30px;
      left: 120px;
      bottom: 10px;
    }
    .check{
      width: 100%;
      display: flex;
      align-items: center;
      .input{
        flex: 1;
        margin-right: 5px;
      }
      .checkImg{
        cursor: pointer;
      }
    }
  }
}
</style>
