<!-- 发布文章表单封面组件 -->
<template>
  <div class="cover">
    <el-upload
      name="file"
      :show-file-list="false"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-btn">
        <template v-if="localFile">
          <img :src="localFile" alt="图片" />
        </template>
        <template v-else>
          <img
            v-if="props.modelValue && modelValue.imageUrl"
            :src="
              (props.imgUrl ? props.imgUrl : proxy.globalInfo.imageUrl) +
              modelValue.imageUrl
            "
          />
          <span v-else class="iconfont icon-add"><!-- 加号icon --></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="js">
import { ref,getCurrentInstance} from 'vue';
const {proxy} = getCurrentInstance()
const props=defineProps({
  modelValue:{ //双向绑定
    type:Object,
    default:undefined
  },
  imgUrl:{ //图片路径
    type:String,
  }
})
const emit=defineEmits()
//是否为本地预览
const localFile=ref()
const uploadImage=async(file)=>{
  file=file.file
  let img=new FileReader()//读取文件器
  img.readAsDataURL(file)//读取文件 读取完成触发 onload
  //接收base64编码的图片
  img.onload=({target})=>localFile.value=target.result 
  emit('update:modelValue',file)
}
</script>

<style scoped lang="scss">
.cover {
  .cover-btn {
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    overflow: hidden;//加上这一段就可以避免超出
    align-items: center;
    background-color: #f2f2f2;
    .iconfont {
      font-size: 50px;
      background-color: #f2f2f2;
    }
    img{
      width: 100%;
      height: 80%;
      cursor: pointer;
    }
  }
}
</style>
