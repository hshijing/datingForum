import "./assets/icon/iconfont.css"; //icon图标
import "element-plus/dist/index.css"; //饿了么默认样式
import elementPlus from 'element-plus'
import "./css/index.scss";
import { createApp } from "vue";
import App from "./App.vue"; //跟组件
import router from "./router"; //路由
import stores from "./stores/index"; //仓库
import VueCookies from "vue-cookies"; //cookies
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
const app = createApp(App);
app.config.globalProperties.VueCookies = VueCookies;//设置请求体Cookies
app.config.globalProperties.globalInfo = {
  webUrl: import.meta.env.VITE_WEB_DOMAIN, //网站地址
  avatrUserUrl: '/api/file/getAvatar/', //头像
  imageUrl: '/api/file/getImage/', //图片前缀
}
app.use(stores);
app.use(router);
app.use(elementPlus, {
  locale: zhCn,
})
app.mount("#app");
