enum API {
  loadBoard = '/board/loadBoard', //获取所有板块
  saveBoard = '/board/saveBoard', //保存板块
  delBoard = '/board/delBoard', //删除板块
  changeBoardSort = '/board/changeBoardSort', //修改板块排序
}
import axios from '../../utils/axios'

//获取所有板块
export const ReqloadBoard = (): Promise<loadBoard> => {
  return axios({ url: API.loadBoard })
}

//保存板块
export const ReqsaveBoard = (params: SaveBoard): Promise<loadBoard> => {
  return axios({ url: API.saveBoard,params })
}

//删除板块
export const ReqdelBoard = (boardId:number): Promise<reqNull> => {
  return axios({ url: API.delBoard, params: { boardId } })
}

//修改板块排序
export const ReqchangeBoardSort = (boardIds:any): Promise<reqNull> => {
  return axios({ url: API.changeBoardSort, params: { boardIds } })
}
//保存板块携带参数
interface SaveBoard {
  boardId:number //| 板块ID       | 否，修改时必传 |
  pBoardId:number // | 父级板块ID   | 是             |
  boardName:string //| 板块名称     | 是             |
  boardDesc:string //| 板块描述     | 是             |
  cover?:string // | 封面，文件流 | 否             |
}

interface req {
  code: number
  info: string
  status: string
}
//获取板块数据
interface loadBoard extends req {
  data: loadBoardArr
}
export type loadBoardArr = loadBoardObj[]

export interface loadBoardObj {
  boardId: number //板块ID
  pBoardId?: number //父板块ID
  boardName: string //板块名称
  cover?: string|undefined //封面
  boardDesc: string //简介
  sort: number //排序
  postType: number //是否可以发帖 0:不可以 1:可以
  children?: loadBoardArr
}
interface reqNull extends req {
  data:null
}