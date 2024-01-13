import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginNode } from "vite-plugin-node"

// https://vitejs.dev/config/
export default defineConfig((command) => {
    return {
        // 原始
        plugins: [vue()],
        build: {
            minify: command.mode == "development" ? false : true
        }
    }


})
