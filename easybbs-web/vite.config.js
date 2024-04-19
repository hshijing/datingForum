import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  /* 配置代理 */
  server:{
    hmr:true,
    port:3004,
    proxy:{
      "/api":{
        target:"http://127.0.0.1:7070",
        changeOrigin:true,
        pathRewrite:{
          "^api":"/api"
        }
      }
    }
  },
  /* 打包 */
  build:{
    chunkSizeWarningLimit:3*1000,
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('node_modules')){
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        chunkFileNames:'static/js/[name]-[hash].js',
      }
    }
  }
})
