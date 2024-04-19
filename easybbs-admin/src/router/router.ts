export const routerArr = [
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/',
    component: () => import('../views/home/index.vue'),
    redirect: '/forum/article',
    children: [
      {
        path: '/forum',
        name: '内容管理',
        children: [
          {
            path: '/forum/article',
            name: '帖子管理',
            component: () => import('../views/forum/articleList.vue'),
          },
          {
            path: '/forum/comment',
            name: '评论管理',
            component: () => import('../views/forum/commentList.vue'),
          },
          {
            path: '/forum/board',
            name: '板块管理',
            component: () => import('../views/forum/boardList.vue'),
          },
        ],
      },
      {
        path: '/user',
        name: '用户管理',
        children: [
          {
            path: '/user/list',
            name: '用户列表',
            component: () => import('../views/user/userList.vue'),
          },
        ],
      },
      {
        path: '/settings',
        name: '设置',
        children: [
          {
            path: '/settings/sys',
            name: '系统设置',
            component:()=>import('../views/settings/index.vue') ,
          },
        ],
      },
    ],
  },
]
