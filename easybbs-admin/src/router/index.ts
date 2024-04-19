import { createRouter,createWebHashHistory } from 'vue-router'
import {routerArr} from './router';
//@ts-ignore 路由进度条
import nprogress from 'nprogress'; 
import 'nprogress/nprogress.css' //引入样式
const router = createRouter({
  history: createWebHashHistory(),
  routes: routerArr,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

router.beforeEach(() => {
  //开启进度条
  nprogress.start();
});
//后置守卫
router.afterEach(() => {
  //关闭进度条
  nprogress.done();
});
export default router
