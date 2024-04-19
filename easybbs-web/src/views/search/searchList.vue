<template>
  <div class="list" :style="{ width: `${proxy.globalInfo.herderWidth}px` }">
    <!-- 文章列表 -->
    <div class="article-list">
      <dateList
        :dateSource="articleListInfo"
        :_loding="_loding"
        @locatDate="updatePageNo"
        :dateListMsg="`暂未发现文章`"
      >
        <template #default="{ date }">
          <AticleItem :date="date" :showTitle="true"/>
        </template>
      </dateList>
    </div>
  </div>
</template>

<script setup lang="js">
import { getCurrentInstance, ref,watch } from 'vue';
import AticleItem from '../forum/AticleItem.vue';//每个文章的组件
import dateList from '@/components/dateList.vue';//分页器
import {ReqSearch} from '@/api/artcle';
import {useRoute} from 'vue-router';
const route=useRoute()
const {proxy}=getCurrentInstance()
//存储文章列表的数据
const articleListInfo=ref({})
//是否显示骨架 数据未响应 显示  数据已返回  关闭
const _loding=ref(false)
const keyword=ref('')
const pageNo=ref(1)
//点击分页器的上|下一页 修改当前页码
const updatePageNo=(pageNO)=>{
  pageNo.value=pageNO
  searchClick()
}
////搜索按钮->键盘按下 发送请求获取文章列表
const searchClick=async()=>{
  _loding.value=true//打开骨架屏
  let params={
    keyword:keyword.value,
    pageNo:pageNo.value
  }
  const res= await ReqSearch(params)
  _loding.value=false//关闭骨架
  if(!res) return
  articleListInfo.value=res.data//接收数据
  //搜索相关高亮
  let list=res.data.list
  list.forEach(item=>{
    item.title=item.title.replace(
      keyword.value,
      '<span style="color:red">'+keyword.value+'</span>'
    )
  })
}
//监听路由的query变化 进行搜索
watch(
  ()=>route.query.keyword,
  (newVal)=>{
    if(newVal!==undefined){
      keyword.value=newVal
      searchClick(newVal)
    }
  },
  {immediate:true,deep:true}
)
</script>

<style scoped lang="scss">
.list {
  margin: 0 auto;
}
</style>
