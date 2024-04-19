<!-- 积分纪律组件 -->
<template>
  <MydilongVue
    :show="dilongConfig.show"
    :titel="dilongConfig.titel"
    :show-close="true"
    @close="closeHanderl"
    width="500"
  >
    <el-form :model="formDate" ref="formRef">
      <el-form-item prop="createTimeRange">
        <el-date-picker
          v-model="formDate.createTimeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="TimeChang"
        />
      </el-form-item>
    </el-form>
    <dateListVue
      :dateSource="recordInfo"
      :_loding="loding"
      @locatDate="locatDateChange"
      :dateListMsg="`暂未相关记录`"
    >
      <template #default="{ date }">
        <div class="date-time">
          <!-- 类型 -->
          <div class="type">{{date.operTypeName}}</div>
          <!-- 积分数量 -->
          <div :class="['integral',date.integral>0?'add':'reduce']">
            {{date.integral}}
          </div>
          <!-- 操作时间 -->
          <div class="time">{{date.createTime}}</div>
        </div>
      </template>
    </dateListVue>
  </MydilongVue>
</template>

<script setup lang="js">
import MydilongVue from '@/components/Mydilong.vue';
import dateListVue from '@/components/dateList.vue';
import {ref,nextTick} from 'vue';
import {ReqloadUserIntegralRecord} from '@/api/usernter';
//弹窗信息
const dilongConfig=ref({
  show:false,
  titel:'用户积分记录',
})
const formDate=ref({})//表单内容数据
const formRef=ref()//表单实例
const  recordInfo=ref({})//表格信息收集
const loding=ref(false)//骨架屏
//表单关闭按钮
const closeHanderl=()=>{
  dilongConfig.value.show=false
}
//获取用户积分记录 日期变化时触发
const TimeChang=async()=>{
  try {
    loding.value=true
    const params={
      pageNo:formDate.value.pageNo,
      createTimeStart:formDate.value.createTimeRange[0],
      createTimeEnd:formDate.value.createTimeRange[1]
    }
    const res=await ReqloadUserIntegralRecord(params)
    if(res.code==200){
      recordInfo.value=res.data
      loding.value=false
    }
  } catch (error) {
    loding.value=false
    return Promise.reject('积分列表获取失败',error)
  }
}
//暴露的函数 ->> 父组件点击积分调用获取
const GetrecordInfo=()=>{
  dilongConfig.value.show=true//父组件点击编辑按钮
  nextTick(()=>{
    formRef.value.resetFields()//重置表单
    TimeChang()//获取用户积分记录
  })
}
//分页器变化
const locatDateChange=(page)=>{
  formDate.value.pageNo=page
  TimeChang()
}
defineExpose({GetrecordInfo})
</script>
<style lang="scss" scoped>
.date-time{
  display: flex;
  border-bottom:1px solid #ddd;
  padding: 10px 0;
  .type{
    width: 120px;
  }
  .integral{
    width: 120px;
  }
  .add{
    color: red;
  }
  .reduce{
    color: green;
  }
  .time{
    text-align: center;
    flex: 1;
  }
}
</style>