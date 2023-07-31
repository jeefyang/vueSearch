import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginNode } from "vite-plugin-node"

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3006
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/server/server.ts',
        }),
    ]
})
