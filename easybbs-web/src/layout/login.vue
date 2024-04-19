<template>
  <!-- 登录|注册 -->
  <mydilong
    :show="dilongConfig.show"
    :titel="dilongConfig.titel"
    @close="close"
    width="400"
  >
    <el-form :model="formDate" ref="form" :rules="rules" style="width: 100%">
      <!-- 邮箱  登录|注册|找回  start-->
      <el-form-item prop="email">
        <el-input
          clearable
          placeholder="请输入邮箱"
          size="large"
          type="text"
          v-model="formDate.email"
        >
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <!-- 邮箱  登录|注册|找回  end-->

      <!-- 邮箱验证码  注册|找回  start-->
      <el-form-item v-if="opType === 0 || opType === 2" prop="emailCode">
        <div class="check-code-panel">
          <el-input
            clearable
            placeholder="请输入邮箱验证码"
            size="large"
            type="text"
            v-model="formDate.emailCode"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <el-button
            type="primary"
            size="large"
            style="margin-left: 10px"
            @click="getEmaliClick()"
            >获取验证码</el-button
          >
        </div>
        <el-popover placement="left" :width="400" trigger="hover">
          <div>
            <p>1、在垃圾箱中查找邮箱验证码</p>
            <p>2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
            <p>3、将邮箱【laoluo@wuhancoder.com】添加到白名单</p>
            <a
              href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP"
              target="_blank"
              style="text-decoration: none; color: #409eff"
              >不知道怎么设置？
            </a>
          </div>
          <template #reference>
            <span style="cursor: pointer; color: #409eff"
              >未获取到验证码？</span
            >
          </template>
        </el-popover>
      </el-form-item>
      <!-- 邮箱验证码  注册|找回  end-->

      <!-- 昵称 注册 start-->
      <el-form-item v-if="opType === 0" prop="nickName">
        <el-input
          placeholder="请输入昵称"
          size="large"
          v-model="formDate.nickName"
        >
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <!-- 昵称 注册 end-->

      <!-- 密码 登录|注册|找回 start-->
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          size="large"
          v-model="formDate.password"
          type="password"
          show-password
        >
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <!-- 密码 登录|注册|找回 end-->

      <!-- 再次输入密码  注册|找回 start-->
      <el-form-item v-if="opType === 0 || opType === 2" prop="password1">
        <el-input
          placeholder="请再次输入密码"
          size="large"
          v-model="formDate.password1"
          type="password"
          show-password
        >
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <!-- 再次输入密码  注册|找回 end-->

      <!-- 验证码 登录|注册|找回 start-->
      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input
            placeholder="请输入验证码"
            size="large"
            type="text"
            v-model="formDate.checkCode"
            @keyup.enter="LoginOrregisterOrResetPwd"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img
            :src="checkCodeUrl"
            class="check-code"
            alt="验证码"
            @click="getCheckCode(0)"
          />
        </div>
      </el-form-item>
      <!-- 验证码 登录|注册|找回 end-->

      <!-- 记住我 start -->
      <el-form-item>
        <el-checkbox v-model="formDate.rememberMe">
          <span>记住我</span>
        </el-checkbox>
      </el-form-item>
      <!-- 记住我 end -->

      <!-- 注册 忘记密码 start -->
      <div class="no-account">
        <a
          href="javascript:void(0)"
          v-if="opType === 1"
          style="color: #409eff; text-decoration: none"
          @click="ForgotPassword(2)"
        >
          忘记密码？
        </a>
        <a
          href="javascript:void(0)"
          v-if="opType === 2"
          @click="ForgotPassword(1)"
          style="color: #409eff; text-decoration: none"
          >去登录
        </a>
        <a
          href="javascript:void(0)"
          v-if="opType === 0"
          @click="ForgotPassword(1)"
          style="color: #409eff; text-decoration: none"
          >已有账号？ </a
        ><a
          href="javascript:void(0)"
          v-if="opType === 1"
          @click="ForgotPassword(0)"
          style="
            color: #409eff;
            text-decoration: none;
            position: relative;
            left: 220px;
          "
          >没有账号?
        </a>
      </div>
      <!-- 注册 忘记密码 end -->

      <!-- 登录按钮  start-->
      <el-form-item>
        <button
          class="login-btn"
          type="button"
          @click="LoginOrregisterOrResetPwd"
        >
          <span>{{
            opType === 1 ? '登录' : opType === 0 ? '注册' : '确认重置'
          }}</span>
        </button>
      </el-form-item>
      <!-- 登录按钮  end-->
    </el-form>
  </mydilong>
  <!-- 邮箱验证码弹窗 -->
  <mydilong
    :show="dilongConfig.getEmailCode"
    titel="获取邮箱验证码"
    @close="dilongConfig.getEmailCode = false"
    width="400"
  >
    <el-form :model="getEmailCodeDate" ref="getEmailCodeRef" :rules="rules">
      <el-form-item label="邮箱">
        <span>{{ formDate.email }}</span>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          placeholder="请输入邮箱验证码"
          size="large"
          v-model="getEmailCodeDate.checkCode"
          style="width: 200px"
        >
          <template #prefix>
            <span class="iconfont icon-checkcode"></span>
          </template>
        </el-input>
        <img :src="eamilCodeUrl" @click="getCheckCode(1)" alt="验证码"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="position: relative; left: 210px; top: 10px"
          @click="getEmailCheckCodeClick"
          >提交验证码
        </el-button>
      </el-form-item>
    </el-form>
  </mydilong>
</template>
<script setup lang="js">
import Mydilong from '@/components/Mydilong.vue';//子组件->弹出框
import { ref, reactive, nextTick, onMounted } from 'vue';
import { r,regs} from '@/utils/loginFromVerify';//抽离表单校验
import {api,ReqEmailChekCode,ReqLoginOrregisterOrResetPwdme} from '@/api/user.js';//api
import {ElMessage} from 'element-plus';
import VueCookies from 'vue-cookies'//设置cookie 7天记录账号密码
import {md5} from 'js-md5';//密码加密
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
const store=useStore()
const router=useRouter()
const form=ref()//表单实例
const getEmailCodeRef=ref()//邮箱验证码弹出框实例
//表单状态类型  0->注册 1->登录  2->找回密码
let opType=ref(1)
const checkCodeUrl=ref()//图片验证码url
const eamilCodeUrl=ref()//注册确认图片验证码
//子组件弹出框传递数据
const dilongConfig=reactive({
  show:false,
  getEmailCode:false,
  titel:'',
})
//注册确认表单信息收集
const getEmailCodeDate=reactive({
  email:'',
  checkCode:'',
  type:opType.value,
})
//表单收集数据
const formDate=reactive({
  email:'',//邮箱
  nickName:'',//昵称
  emailCode:'',//注册邮箱验证码
  password:'',//密码
  password1:'',//二次密码
  checkCode:'',//图形验证码
  rememberMe:false ,//记住我？
})
//注册表单两次密码是否一致验证
const passwordYiYang=(rule, value, callback)=>{
  if(value!==formDate.password){
    callback(new Error(rule.message))
  }else{
    callback()
  }
}
//表单校验
const rules=Object.assign({},{
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: regs.regPassword,
      message: '密码为8-16字符组成',
      trigger: 'blur',
    },
  ],
  password1: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: passwordYiYang,
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
},r)
//父组件点击登录调用
const showPanel=()=>{
  resetForm()
}
//打开登录弹窗按钮
const resetForm=()=>{
  dilongConfig.show=true
  //设置弹出框title
  switch(opType.value){
    case 0:dilongConfig.titel='注册';break;
    case 1:dilongConfig.titel='登录';break;
    case 2:dilongConfig.titel='重置密码';break;
  }
  //重置表单内容并清空验证
  nextTick(()=>{
    form.value.clearValidate()
    Object.keys(formDate).forEach(key=>formDate[key]=null)
    //数据回显
    rememberMeDate()
  })
}
//登录框关闭按钮
const close=()=>{
  dilongConfig.show = false
  store.commit('showlogin',false)
}
//登录时记住密码的表单数据回显
const rememberMeDate=()=>{
  const cookieInfo=VueCookies.get('loginInfo')
    if(opType.value===1&&!!cookieInfo){
      formDate.email=cookieInfo.email
      formDate.password=cookieInfo.password
      formDate.rememberMe=cookieInfo.rememberMe
    }
    getCheckCode(0)
}
//忘记密码按钮
const ForgotPassword=(type)=>{
  opType.value=type
  resetForm()
  getCheckCode(0)
}
//发送图形验证码
const getCheckCode=(type)=>{
  if(type===0){
    checkCodeUrl.value=`${api.checkCode}?type=${type}+&time=${new Date().getTime()}`
  }else if(type===1){
    eamilCodeUrl.value=`${api.checkCode}?type=${type}+&time=${new Date().getTime()}`
  }
}
//获取验证码按钮
const getEmaliClick=()=>{
  form.value.validateField('email',(valid)=>{
    if(!valid) return;
    //页面显示前请求图片验证码
    getCheckCode(1)
    dilongConfig.getEmailCode=true
    //收集注册确定表单数据
    getEmailCodeDate.email=formDate.email
    nextTick(()=>{
      //清空上次收集数据与校验
      getEmailCodeDate.checkCode=''
      getEmailCodeRef.value.clearValidate()
    })
  })
}
//图片验证码二次确认 成功->发送邮箱验证码 失败再次刷新图片验证码
const getEmailCheckCodeClick=async()=>{
    try {
      await getEmailCodeRef.value.validate()//表单校验
      //发送请求
      const res=await ReqEmailChekCode(getEmailCodeDate,getCheckCode,1)
      if(res&&res.code===200){
        ElMessage.success('发送成功')
        dilongConfig.getEmailCode=false//返回注册页
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
//登录md5加密
const JiaMi=(formDate)=>{
  //拷贝表单数据
  let parms = { ...formDate };
  //获取cookie存储的数据
  const cookie=VueCookies.get('loginInfo')
  //获取存储的密码
  const cookiePaw=cookie===null?null:cookie.password
  //如果表单密码和cookie密码不一致 表单密码为原始密码 需要加密
  if(opType.value!==0&&parms.password!==cookiePaw){
    parms.password=md5(parms.password)
  }
  //表示使用7天记录密码
  if (formDate.rememberMe) {
    //收集cookie需要存储的数据
    const loginInfo = {
      email: parms.email,
      password: parms.password,
      rememberMe: parms.rememberMe,
    }
    //设置cookie
    VueCookies.set('loginInfo', loginInfo, '7d')
  } else {
    //表示没有勾选7天记录密码 需要干掉cookie的存储数据
    VueCookies.remove('loginInfo')
  }
  return parms
}
//登录|注册|重置密码 表单提交
const LoginOrregisterOrResetPwd=async()=>{
  try {
    await form.value.validate()//表单校验
    //收集需要携带的请求体数据
    const parms=JiaMi(formDate)
    //发送请求
    const res=await ReqLoginOrregisterOrResetPwdme(opType,parms,getCheckCode)
    if(res&&res.code===200){
      // 登录->关闭弹出框  注册|找回密码 ->跳转登录
      if(opType.value===1){
        dilongConfig.show=false
        //调用仓库方法 进行头像显示
        store.commit('updateLoginInfo',res.data)
      }else{
        opType.value=1
      }
      //提示用户
      ElMessage({
        type:'success',
        message:opType.value===0?'注册成功,请登录':opType.value===1?'登录成功':'重置密码成功'
      })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
onMounted(()=>{
  getCheckCode(0)
})
defineExpose({showPanel})
</script>
<style scoped lang="scss">
.check-code-panel {
  display: flex;
  .check-code {
    margin-left: 10px;
    cursor: pointer;
  }
}
.login-btn {
  border: none;
  position: relative;
  left: 20px;
  width: 300px;
  height: 80px;
  padding: 0;
  z-index: 2;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  -webkit-mask-size: 100%;
  cursor: pointer;
  background-color: transparent;
  transform: translateY(8px);
}

.login-btn:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 0 0 0 white;
  transition: all 2s ease;
}
.login-btn:hover:after {
  box-shadow: 0px -13px 56px 12px #ffffffa6;
}

.login-btn span {
  position: absolute;
  width: 100%;
  font-size: 15px;
  font-weight: 100;
  left: 50%;
  top: 39%;
  letter-spacing: 3px;
  text-align: center;
  transform: translate(-50%, -50%);
  color: black;
  transition: all 2s ease;
}

.login-btn:hover span {
  color: white;
}

.login-btn:before {
  content: '';
  position: absolute;
  width: 0;
  height: 100%;
  background-color: black;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 1s ease;
}

.login-btn:hover:before {
  width: 100%;
}
</style>
