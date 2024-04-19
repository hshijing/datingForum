<template>
  <div class="search">
    <el-form :model="searchForm" label-width="50px">
      <el-row>
        <!-- 昵称 -->
        <el-col :span="4">
          <el-form-item label="昵称" prop="nickNameFuzzy">
            <el-input
              v-model="searchForm.nickNameFuzzy"
              placeholder="请输入昵称"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- 性别 -->
        <el-col :span="4">
          <el-form-item label="性别" prop="sex">
            <el-select
              placeholder="请选择性别"
              v-model="searchForm.sex"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option :value="0" label="女"></el-option>
              <el-option :value="1" label="男"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 状态 -->
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-select
              placeholder="请选择"
              v-model="searchForm.status"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option :value="0" label="已封禁"></el-option>
              <el-option :value="1" label="正常"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="5" :style="{ 'padding-left': '20px' }">
          <el-button type="primary" @click="getUserList">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <!-- 表格 -->
  <div class="list">
    <MyTableVue
      v-if="tableData"
      :columns="colums"
      ref="MyTableRef"
      :options="options"
      :tableData="tableData"
      :fetch="getUserList"
      :tabHeight="100"
      :showPagination="true"
    >
      <!-- 头像 -->
      <template #avatar="{ row }: { row: LISTObj }">
        <userInfoVue :user-id="row.userId" />
      </template>
      <template #nickName="{ row }: { row: LISTObj }">
        {{ row.nickName }}
        <span v-if="row.sex">{{ row.sex == 1 ? '男' : '女' }}</span>
      </template>
      <template #loginInfo="{ row }: { row: LISTObj }">
        <div>最后登录时间:{{ row.lastLoginTime }}</div>
        <div>最后登录IP:{{ row.lastLoginIp }}</div>
        <div>最后登录地址:{{ row.lastLoginIpAddress }}</div>
      </template>
      <template #integral="{ row }: { row: LISTObj }">
        <div>总积分：{{ row.totalIntegral }}</div>
        <div>当前积分:{{ row.currentIntegral }}</div>
      </template>
      <template #status="{ row }: { row: LISTObj }">
        <span v-if="row.status == 1" :style="{ color: 'green' }">正常</span>
        <span v-else  :style="{ color: 'red' }">封禁</span>
      </template>
      <template #op="{ row }: { row: LISTObj }">
        <div class="op-btns" v-if="row.status != -1">
          <el-dropdown trigger="click">
            <span class="iconfont icon-more"></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="updateUserStatus(row)">
                  {{ row.status == 1 ? '封禁' : '解封'}}
                </el-dropdown-item>
                <el-dropdown-item @click="postMessage(row)">
                  发送系统消息
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </MyTableVue>
  </div>
  <!-- 弹窗 发送消息 -->
  <sendMessageVue ref="sendMessageRef" @sendClick="getUserList"/>
</template>

<script setup lang="ts">
import MyTableVue from '../../components/MyTable.vue'
import userInfoVue from '../../components/userInfo.vue'
import sendMessageVue from './sendMessage.vue'
import { colums } from './userlist'
import { confirm } from '../../utils/Confirm' //确认框
import {ElMessage} from 'element-plus';
import { ref, onMounted } from 'vue';
import {
  ReqloadUserList,
  RequpdateUserStatus,
  User,
  LISTObj,
  //@ts-ignore
} from '../../api/user'
const searchForm = ref({
  nickNameFuzzy: '',
  sex: undefined,
  status: undefined,
})
const sendMessageRef=ref()
//表格数据
const tableData = ref()
//表格属性
const options = ref({
  tabHeight: 670,
  extHeight: 0,
  stripe: true,
  border: false,
  showIndex: true,
  selectType: '',
})
//获取用户列表
const getUserList =async () => {
  try {
    const params:User={
      pageNo:tableData.value?.pageNo||1,
      pageSize:tableData.value?.pageSize||15,
      sex:searchForm.value.sex,
      status:searchForm.value.status,
      nickNameFuzzy:searchForm.value.nickNameFuzzy
    }
    const res=await ReqloadUserList(params)
    if(res.code===200){
      tableData.value=res.data
    }
  } catch (error) {
    console.log('获取用户列表失败');
    throw error;
  }
}
//封禁或解封用户
const updateUserStatus=(row:LISTObj)=>{
    const type=row.status===1?'封禁':'解封'
  try {
    confirm(`确定要${type}【${row.nickName}】吗？`, async () => {
      const res = await RequpdateUserStatus({
        userId:row.userId,
        status:row.status===1?0:1
      })
      if (!res) return
      getUserList()
      ElMessage.success(`${type}成功`)
    })
  } catch (error) {
    ElMessage.error(`${type}失败`)
    throw error
  }
}
//发送系统消息
const postMessage=(row:LISTObj)=>{
  sendMessageRef.value.sendMessage(row)
}
onMounted(()=>{
  getUserList()
})
</script>

<style scoped>
.op{
  cursor: pointer;
}
.iconfont{
  cursor: pointer;
}
</style>
