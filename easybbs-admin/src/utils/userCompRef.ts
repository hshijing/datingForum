import { ref } from "vue";

/* 封装ref  获得组件类型实例方法*/
export function MyRef<T extends abstract new (...args: any) =>
  any>(_comp:T){
  return ref<InstanceType<T>>()
}