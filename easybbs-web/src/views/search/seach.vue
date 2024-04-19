<template>
  <div class="content">
    <el-form :model="formDate" :rules="rules" ref="formRef">
      <el-form-item prop="keyword">
        <el-input
          v-model="formDate.keyword"
          @keydown.enter="searchClick"
          placeholder="搜索..."
        >
          >
          <template #suffix>
            <span
              class="iconfont icon-search"
              @click="searchClick"
              @blur="formDate.keyword = $event.target.value.trim()"
            ></span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <!--  <div class="list" v-if="recentSearch.size>0&&InputFocus">
      <div class="title">
        <span class="herder">搜索历史</span>
        <span class="herder" @click="removeRes">清空</span>
      </div>
      <div class="card" v-for="it in recentSearch" :ket="it">
        <span class="span">{{it}}</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="js">
import { ref,watch} from 'vue';
import {useRouter,useRoute} from 'vue-router';
const router=useRouter()
const route=useRoute()
const formDate=ref({})//表单数据
const formRef=ref()//表单实例
//表单校验
const rules={
  keyword:[
    { required: true, message: '请输入内容',trigger: 'change' },
    { min:3, message: '关键字不少三两位',trigger: 'change' }
  ]
}
//搜索按钮->键盘按下
const searchClick=async(e)=>{
  try {
    e.preventDefault()
    await formRef.value.validate()
    //表单校验通过，跳转到搜索页面
    router.push({
      path:'/search',
      query:{keyword:formDate.value.keyword}
    })
  } catch (error) {
    return Promise.reject('搜索跳转失败',error)
  }
}
/*
//最近搜索列表
const recentSearch=ref(new Set())
//记录表单获得焦点
const InputFocus=ref(false)
//表单获得焦点
const InputFocusClick=()=>{
  InputFocus.value=true//打开历史搜索
}
//表单失去焦点
const InputBlurClick=()=>{
  InputFocus.value=false//关闭历史搜索
}
//添加最近搜索记录
const recentSearchFunc=()=>{
  recentSearch.value.add(formDate.value.keyword)
  //只保存5条记录
  if(recentSearch.value.size>5){
    //删除第一个记录
    recentSearch.value.delete(recentSearch.value.keys().next().value)
  }
}
//清空搜索历史
const removeRes=()=>{
  nextTick(()=>{
    recentSearch.value.clear()
  })
} */
//监听路由变化，干掉输入框的值
watch(
  ()=>route.path,
  (newVal)=>{
      formDate.value.keyword=''
      formRef.value.resetFields()
  },
)
</script>

<style scoped lang="scss">
.content {
  position: relative;
  top: 10px;
  left: 20px;
  display: flex;
  justify-content: center;

  .icon-search {
    cursor: pointer;
  }
  .list {
    width: 210px;
    position: absolute;
    top: 35px;
    background-color: #fff;
    .title{
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      margin: 4px;
      .herder{
        cursor: pointer;
      }
    }
    .card {
      margin-left: 10px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
      padding: 2px 0;
      .span {
        cursor: pointer;
        font-size: 12px;
        width: 80px;
        color: rgb(97, 97, 97);
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 内容超出隐藏 */
        text-overflow: ellipsis; /* 超出显示省略号 */
      }
      .span:hover {
        color: rgb(14, 114, 214);
        cursor: pointer;
      }
    }
  }
}
</style>
