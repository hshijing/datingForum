import { ReqGetPlate } from '@/api/plate'
export const plate = {
  state: {
    //存储板块信息
    plateList: JSON.parse(localStorage.getItem('PlateListInfo'))||[],
    //存储一级板块id
    AcivePboardId: 0,
    //存储二级板块id
    AciveboarId: 0,
  },
  mutations: {
    //获取当前板块
    PlateListInfo(state, value) {
      state.plateList = value
    },
    //存储当前的一级板块id
    setAcivePboardId(state, value) {
      state.AcivePboardId = value
    },
    //存储当前的二级板块id
    setAciveboarId(state, value) {
      state.AciveboarId = value
    },
  },
  actions: {
    //获取当前板块
    async getPlateList({ commit }) {
      const res = await ReqGetPlate()
      if (res.code === 200) {
        commit('PlateListInfo', res.data)
        //存储本地 减少请求次数 每次打开页面请求一次就行了
        localStorage.setItem('PlateListInfo', JSON.stringify(res.data))
      }
    },
  },
  getters: {
    //返回当前二级板块id
    getSubPlateList: (state) => (boardId) => {
      let board = state.plateList.find((it) => {
        return it.boardId == boardId
      })
      return board ? board.children : []
    },
    //返回一级id
    getAcivePboardId: (state) => {
      return state.acivePboardId
    },
  },
}
