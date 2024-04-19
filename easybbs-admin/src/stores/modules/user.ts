import { defineStore } from "pinia";
import { ref } from 'vue';
export const UserStore = defineStore("User-store",()=>{
  const deactivate = ref < string>()//菜单高亮选中
  const Updatedeactivate = (date: string) => {
    deactivate.value = date
  }
  return {
    Updatedeactivate,
    deactivate,
  }
},
{persist:true}
);
