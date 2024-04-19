import 'element-plus/dist/index.css'//饿了么默认样式
import '@/assets/icon/iconfont.css'//icon图标
import VueCookies from 'vue-cookies'; //cookies
import elementPlus from 'element-plus';//UI组件库
import '@/css/index.scss';//默认样式
import editorHTML from './components/editor/editorHTML.vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './vuex/index';
const app = createApp(App)
export const eventBus = app
app.config.globalProperties.VueCookies = VueCookies;//设置请求体Cookies
/* 定义一些全局变量 */
app.config.globalProperties.globalInfo = {
  herderWidth: 1300, //视口宽度
  avatrUserUrl: '/api/file/getAvatar/', //头像
  imageUrl: '/api/file/getImage/', //图片前缀
}
app.use(elementPlus)//elementlus
app.use(router)//路由
app.use(store)//仓库
app.component('editorHTML', editorHTML)
app.mount('#app')
