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
    label: '封面',
    prop: 'cover',
    width: 100,
    scopedSlots: 'cover',
  },
  {
    label: '板块信息',
    prop: 'board',
    width: 210,
    scopedSlots: 'board',
  },
  {
    label: '简介',
    prop: 'boardDesc',
  },
  {
    label: '操作',
    width: 200,
    prop: 'op',
    scopedSlots: 'op',
  },
]
// 验证规则
export const rules = {
  boardName: [{ required: true, message: '请输入板块名称' }],
  postType: [{ required: true, message: '请选择发帖权限' }],
  boardDesc: [{ required: true, message: '请输入板块简介' }],
}