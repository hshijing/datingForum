<!-- 评论输入框 -->
<template>
  <div class="from-panel-post">
    <!-- 头像 -->
    <userInfoVue
      :userId="userId"
      :width="width"
      :LEFT="`0px`"
      :TOP="`0px`"
      @click="userInfoCilck"
    />
    <!-- 输入框 -->
    <div class="from">
      <el-form :model="fromDate" ref="formRef" :rules="rules">
        <el-form-item>
          <el-input
            type="textarea"
            v-model="fromDate.content"
            :placeholder="placeholderInfo"
            clearable
            :rows="2"
            :maxlength="300"
            resize="none"
            show-word-limit
            @blur="BlurContent"
          />
          <!-- 图片上传 -->
          <div class="img" v-if="showImgIndex">
            <div class="comment-img" v-if="commentImg" >
              <commentImageVue :src="commentImg"/>
              <span class="iconfont icon-remove" @click="removeCommentImg"/>
            </div>
            <el-upload v-else
              name="file"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.GIF"
              :multiple="false"
              :http-request="selectImg"
            >
              <span class="iconfont icon-image"></span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 发布按钮 -->
    <div class="btn" @click="SendpostComment">发布</div>
  </div>
</template>

<script setup lang="js">
import userInfoVue from '@/components/userInfo.vue';//头像组件
import commentImageVue from './commentImage.vue';//图片上传
import {ref} from 'vue';
import {useStore} from 'vuex';
import {ReqPostComment} from '@/api/comments'
import {showLogin} from '@/utils/showLogin';
import {ElMessage} from 'element-plus';
const _props=defineProps({
  width:Number,//头像宽度
  userId:String,//用户ID
  showImgIndex:Boolean,//是否显示图片上传按钮
  placeholderInfo:String,//输入框提示信息
  articleId:String,//文章id
  pCommentId:Number,//父评论id
  replyUserId:String,//回复的用户id
})
const emit=defineEmits(['BlurContent','postCommentFinish'])
const store=useStore()
//表单实例
const formRef=ref()
//表单相关信息
const fromDate=ref({})
//校验转换  文字|图片|表情
const checkContent=(rule,value,callback)=>{
  if(value==null&&fromDate.value.image==null){
    callback(new Error('请输入评论内容'))
  }else{
    callback()
  }
}
const rules={
  content:[
    {required:true,message:'请输入评论内容',validator:checkContent},
    {min:1,max:200,message:'少爷请评论',}
  ]
}
//评论区图片上传
const commentImg=ref(undefined)//图片上传地址
const selectImg=(fileDate)=>{
  const {file}=fileDate
  //读取API
  let img=new FileReader()
  img.readAsDataURL(file)
  //读取文件完毕事件
  img.onload=({target})=>{
    let imgDate=target.result
    commentImg.value=imgDate
    fromDate.value.image=file
  }
}
//图片移除
const removeCommentImg=()=>{
  commentImg.value=undefined
  formRef.value.image=undefined
}
//发布评论
const SendpostComment=async()=>{
  try {
    if(!showLogin(store)) return //登录校验
    await formRef.value.validate()//表单校验  
    //整理参数
    let params=Object.assign({},fromDate.value)
      params.articleId=_props.articleId//文章ID
      params.pCommentId=_props.pCommentId//父级评论id 一级评论传0
      params.replyUserId=_props.replyUserId//回复他人ID
    const res=await ReqPostComment(params)
    if(res.code===200){
      ElMessage.success('评论发表成功')
      fromDate.value.content=''   //重置表单
      removeCommentImg() //清空图片地址
      emit('postCommentFinish',res.data)//通知父组件 更新页面数据
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
//评论输入框失去焦点 通知爷组件 干掉所有二级输入框
const BlurContent=()=>{
  if(fromDate.value.content===''){
      emit('BlurContent')
  }
}
//点击头像
const userInfoCilck=()=>{
  if(!showLogin(store)) return //登录校验
}

</script>

<style scoped lang="scss">
.from-panel-post {
  display: flex;
  padding: 0 20px;
  align-items: start;
  .from {
    flex: 1;
    margin: 0 10px;
    .img {
      .icon-image {
        margin-top: 3px;
        font-size: 20px;
      }
      .comment-img{
        position: relative;
        margin-top: 10px;
        .iconfont{
          position: absolute;
          top: -10px;
          right: -8px;
          font-size: 25px;
          cursor: pointer;
        }
      }
    }
  }
  .btn {
    width: 50px;
    height: 50px;
    background-color: #409eff;
    color: #fff;
    border-radius: 5px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
  }
}
</style>
