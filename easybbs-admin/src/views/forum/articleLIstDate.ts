interface Columns {
  prop?: string
  label: string
  align?: string
  width?: number
  scopedSlots?: string
  fixed?: string
}
type colums=Columns[]
//插槽回传数据类型
export interface ArticleObj {
  boardIds?: [pBoardId?: number, boardId?: number]
  articleId: string //文章ID
  boardId: number //板块ID
  boardName: string //板块名称
  pBoardId: number //父级板块
  pBoardName: string //父级板块名称
  userId: string //用户ID
  nickName: string //昵称
  userIpAddress: string //所在地
  title: string //标题
  cover: string //封面
  content: null //内容 列表内容为空
  summary: string //简介
  postTime: string //发布时间
  readCount: number //阅读数
  goodCount: number //点赞数
  commentCount: number //评论数
  topType: number //置顶类型 0:未置顶 1:已置顶
  attachmentType: number //附件类型 0:没附件 1:有附件
  status: number //状态 1 已审核
}
export interface Options {
  stripe: boolean
  border: boolean
  selectType?: string
  showIndex: boolean
  tabHeight: number
  extHeight: number
}
export const colums: colums = [
  {
    label: '用户信息',
    prop: 'avatar',
    width: 200,
    scopedSlots: 'UserInfo',
  },
  {
    label: '封面',
    prop: 'cover',
    width: 100,
    scopedSlots: 'cover',
  },
  {
    label: '标题',
    scopedSlots: 'titleInfo',
  },
  {
    label: '板块',
    width: 200,
    scopedSlots: 'boardInfo',
  },
  {
    label: '互动信息',
    width: 150,
    scopedSlots: 'interactionInfo',
  },
  {
    label: '是否有附件',
    width: 100,
    prop: 'attachment',
    scopedSlots: 'attachmentInfo',
  },
  {
    label: '状态信息',
    width: 100,
    prop: 'start',
    scopedSlots: 'startInfo',
  },
  {
    label: '发布时间',
    width: 180,
    prop: 'postTime',
  },
  {
    label: '操作',
    width: 80,
    prop: 'op',
    scopedSlots: 'op',
  },
]
