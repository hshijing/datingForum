import {ElMessageBox} from 'element-plus';
/**
 * 
 * @param {string} message 提示信息
 * @param {Function} okfun 传递函数
 */
export const confirm =(message,okfun)=>{
  ElMessageBox.confirm(message,'提示',{
    'confirmButtonText': '确定',
    'confirmButtonClass':'取消',
    type:'info'
  })
  .then(async()=>{
    okfun()
  })
  .catch(err=>{
    return Promise.reject('ElMessageBox',err)
  })
}