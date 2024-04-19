/* 板块 */
import Requst from '@/utils/Requst';
const api = {
  plate: '/board/loadBoard',//获取板块分类
} 
//获取板块分类
export const ReqGetPlate = () =>{
  return Requst({ url: api.plate })
}
