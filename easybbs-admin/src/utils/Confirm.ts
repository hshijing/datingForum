import {ElMessageBox} from 'element-plus';
export const confirm =(message:string,okfun:Function)=>{
  ElMessageBox.confirm(message,'提示',{
    'confirmButtonText': '确定',
    'confirmButtonClass':'取消',
    type:'info'
  })
  .then(async()=>{
    okfun()
  })
  .catch(err=>{
    return Promise.reject(err)
  })
}