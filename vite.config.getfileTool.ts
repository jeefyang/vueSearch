import { defineConfig } from 'vite'



// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: "./src/getFileTool.ts",
            name: "getfileTool",
            fileName: "getfileTool",
            formats:['iife']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
            }
        }
    }
})
