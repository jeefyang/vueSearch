import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginNode } from "vite-plugin-node"

import fs from "fs"

import "./src/type.d.ts"

const jsonStr = fs.readFileSync("./public/config.jsonc", "utf-8")
const configjson: JConfigType = global.eval(`(${jsonStr})`)

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: configjson.node_dev_domain,
        port: configjson.node_dev_port
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/server/server.ts',
        }),
    ]
})
