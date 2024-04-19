interface Columns {
  prop?: string
  label: string
  align?: string
  width?: number
  scopedSlots?: string
  fixed?: string
}
type colums = Columns[]

export const colums: colums = [
  {
    label: '用户信息',
    prop: 'avatar',
    width: 200,
    scopedSlots: 'UserInfo',
  },
  {
    label: '评论内容',
    prop: 'content',
    scopedSlots: 'contentInfo',
  },
  {
    label: '点赞',
    width: 150,
    prop: 'goodCont',
    scopedSlots: 'goodContInfo',
  },
  {
    label: '状态',
    width: 100,
    prop: 'status',
    scopedSlots: 'statusInfo',
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
