import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginNode } from "vite-plugin-node"

import fs from "fs"

import "./src/type.d.ts"



// https://vitejs.dev/config/
export default defineConfig({

    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/server/server.ts',
        }),
    ]
})
