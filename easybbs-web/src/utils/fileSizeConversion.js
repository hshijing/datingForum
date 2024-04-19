/* 文件大小单位转化 */
  //映射为对象优化分支 看的不累
const sizeMappings = {
  B: (size) => size.toFixed(2) + 'B',
  KB: (size) => (size/1024).toFixed(2) + 'KB',
  MB: (size) => (size / (1024 * 1024)).toFixed(2) + 'MB',
  GB: (size) => (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
}
/**
    Math.pow(1024, Object.keys(sizeMappings).indexOf(key))  几次幂
    如果size小于当前幂运算后的结果 表示当前size就在次索引 调用对应的属性的方法完事
    Object.keys(sizeMappings).indexOf(key) key在对象的索引位置
     */
export function _convertSize(size) {
  //大于1Tb
  const DaShuJu=1024*1024*1024*1024
  const DaYuTB=0.1*1024*1024*1024*1024
  //小于1tb
  for (const key in sizeMappings) {
    if (size<0.1*1024*Math.pow(1024, Object.keys(sizeMappings).indexOf(key))){
      return sizeMappings[key](size)
    }else if (size >= DaYuTB) {
      return (size / DaShuJu).toFixed(2) + 'TB'
    }
  }
}