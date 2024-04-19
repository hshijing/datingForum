export const constRouter = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    children: [
      /* 首页 */
      {
        path: '/',
        name: '所有文章',
        component: () => import('@/views/forum/AticleList.vue'),
      },
      /* 一级板块 */
      {
        path: '/forum/:pBoardId',
        name: '一级板块',
        component: () => import('@/views/forum/AticleList.vue'),
      },
      /* 二级板块 */
      {
        path: '/forum/:pBoardId/:boardId',
        name: '二级板块',
        component: () => import('@/views/forum/AticleList.vue'),
      },
      /* 文章详情 */
      {
        path: '/post/:acticleId',
        name: '文章详情',
        component: () => import('@/views/forum/AticleDateItem.vue'),
      },
      /* 用户信息 */
      {
        path: '/user/:userId',
        name: '用户信息',
        component: () => import('@/views/usernter/user.vue'),
      },
      /* 发帖 */
      {
        path: '/newPost',
        name: '发帖',
        component: () => import('@/views/publish/index.vue'),
      },
      /* 编辑文章 */
      {
        path: '/editPost/:articleId',
        name: '编辑文章',
        component: () => import('@/views/publish/index.vue'),
      },
      /* 消息 */
      {
        path: '/message/:type',
        name: '消息',
        component:()=>import('@/views/message/MyReply.vue'),
      },
      /* 搜索 */
      {
        path: '/search',
        name: '消息',
        component: () => import('@/views/search/searchList.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]
