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
    label: '头像',
    prop: 'avatar',
    width: 80,
    scopedSlots: 'avatar',
  },
  {
    label: '昵称',
    prop: 'nickName',
    width: 150,
    scopedSlots: 'nickName',
  },
  {
    label: '邮箱',
    prop: 'email',
    width: 180,
  },
  {
    label: '个人描述',
    prop: 'personDescription',
  },
  {
    label: '加入时间',
    width: 180,
    prop: 'joinTime',
  },
  {
    label: '登录信息',
    width: 260,
    prop: 'login',
    scopedSlots: 'loginInfo',
  },
  {
    label: '积分',
    width: 150,
    prop: 'integral',
    scopedSlots: 'integral',
  },
  {
    label: '状态',
    width: 60,
    prop: 'status',
    scopedSlots: 'status',
  },
  {
    label: '操作',
    width: 80,
    prop: 'op',
    scopedSlots: 'op',
  },
]
