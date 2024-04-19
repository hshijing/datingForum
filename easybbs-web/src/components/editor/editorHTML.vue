<template>
  <div class="editor-html" v-if="ModelValue||showEdit">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{ height: props.height + 'px', 'overflow-y': 'hidden' }"
      :model-value="props.ModelValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="js">
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'//富文本插件
import '@wangeditor/editor/dist/css/style.css' //富文本插件样式
import {getCurrentInstance, ref,shallowRef,onBeforeUnmount} from 'vue'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex';
const {proxy}=getCurrentInstance()//全局变量
const props=defineProps({
  ModelValue:{
    type:String,
    default:''
  },
  height:{
    type:Number,
    default:500
  },
  showEdit:Boolean,
})
const store=useStore()//仓库
const emit=defineEmits()//自定义事件
/* 当你需要在组件中存储一个值，并希望在该值发生变化时自动更新相关的视图，这种方式是非常有用的。 */
const mode=ref('default')
const editorRef=shallowRef()//编辑器实例
//工具栏配置项
const toolbarConfig = {
  excludeKeys: ['uploadVideo'], // 隐藏工具栏部分按钮
}
//图片上传函数
const uploadImg = async(responseDate, insertFn) => {
  if (responseDate.code == 200) {
    //本地路径转为远程路径
    const url = proxy.globalInfo.imageUrl + responseDate.data.fileName;
    insertFn(url, "", "");
    return;
  } else if (responseDate.code == 901) {
    //请求失败 登录
    store.commit('showlogin', true);
    store.commit('updateLoginInfo', null);
    return;
  }
  ElMessage.info(responseDate.info);
}
//编辑器配置项
const editorConfig={
  placeholder: '请输入内容...',
  excludeKeys: ['uploadVideo'], // 隐藏编辑器部分按钮 视频
  MENU_CONF: {
    uploadImage: { //图片上传
      maxFileSize: 3*1024*1024, // 设置允许上传图片大小，单位 B 最大3mb
      server: '/api/file/uploadImage',//上传路径
      fieldName: 'file',//name
      customInsert(responseDate, insertFn) {
        uploadImg(responseDate, insertFn)
      }
    }
  }
}
//监听内容变化 双向绑定
const handleChange=(editor)=>{
  emit('update:ModelValue',editor.getHtml())
}
//创建编辑器
const handleCreated=(editor)=>{
  editorRef.value=editor//记录编辑器实例
}

//组件销毁时调用
onBeforeUnmount(()=>{
  const editor=editorRef.value
  if(editor==null){
    //内容为空时调用函数干掉编辑器
    editor.destroy()
  }
})
</script>

<style scoped lang="scss">
.editor-html {
  border: 1px solid #ccc;
}

</style>
