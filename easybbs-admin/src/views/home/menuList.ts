export const menuList = [
  {
    menuName: "内容管理",
    icon: "icon-article",
    path: "/forum",
    children: [
      {
        menuName: "帖子管理",
        path: "/forum/article",
      },
      {
        menuName: "评论管理",
        path: "/forum/comment",
      },
      {
        menuName: "板块管理",
        path: "/forum/board",
      },
    ],
  },
  {
    menuName: "用户管理",
    icon: "icon-user",
    path: "/user",
    children: [
      {
        menuName: "用户列表",
        path: "/user/list",
      },
    ],
  },
  {
    menuName: "设置",
    icon: "icon-settings",
    path: "/settings",
    children: [
      {
        menuName: "系统设置",
        path: "/settings/sys",
      },
    ],
  },
];
type children=menuObj
export interface menuObj {
  menuName: string;
  icon?: string;
  path: string;
  children: children;
}