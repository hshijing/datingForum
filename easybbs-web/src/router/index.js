import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'; //路由进度条
import 'nprogress/nprogress.css' //引入样式
import { constRouter } from "./routers";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constRouter,
  scrollBehavior(){
    return {
      left:0,
      top:0,
    }
  }
})

router.beforeEach((to,from,next)=>{
  //开启进度条
  nprogress.start()
  if(to.path==='user/message/:type'){
    console.log(to)
  }
  next()
})
  //后置守卫
router.afterEach(()=>{
  //关闭进度条
  nprogress.done()
})
export default router
