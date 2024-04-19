<!-- 登录头像 -->
<template>
    <!-- 个人信息 -->
    <div class="attr-login"
      :style="{width:_props.width+'px',height:_props.width+'px',
      borderRadius:_props.width/2+'px',left:LEFT, top:TOP}"
    >
      <el-image v-if="_props.userId"
        :style="{width:_props.width+'px',height:_props.width+'px',
        borderRadius:_props.width/2+'px'}"
        :src="`/api/file/getAvatar/${_props.userId}`"
        fit="scale-down"
        loading="lazy"
        @click="goToUcenter"
      >
      </el-image>
      <div v-else class="no-login" :style="{fontSize:fontSize+'px'}">未登录</div>
    </div>
</template>

<script setup lang="js">
import {useRouter} from "vue-router"
const router=useRouter()
const _props=defineProps({
  userId:{
    type:String,
  },
  width:{
    type:Number,
    default:50
  },
  addLink:{
    type:Boolean,
    default:true
  },
  LEFT:{
    type:String,
    default:'0px'
  },
  TOP:{
    type:String,
    default:'0px'
  },
  fontSize:{
    type:Number,
    default:12
  }
})
const goToUcenter=()=>{
  if(_props.addLink){
    router.push(`/user/${_props.userId}`)
  }
}
</script>

<style scoped lang="scss">
.attr-login{
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  img{
    width: 100%;
    height: 100%;
  }
  .no-login{
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
.attr-login:hover{
  cursor: pointer;
}
</style>
