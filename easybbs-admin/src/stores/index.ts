import { createPinia } from "pinia";
import pin from "pinia-plugin-persistedstate";
import { defineStore } from 'pinia'
import { ref } from 'vue'
const store = createPinia();
export const UserStore = defineStore(
  'User-store',
  () => {
    const deactivate = ref<string>() //菜单高亮选中
    const Updatedeactivate = (date: string) => {
      deactivate.value = date
    }
    return {
      Updatedeactivate,
      deactivate,
    }
  },
  { persist: true },
)
store.use(pin);
export default store;