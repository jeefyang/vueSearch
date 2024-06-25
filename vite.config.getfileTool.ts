import { defineConfig } from 'vite'



// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: "./src/getFileTool.ts",
            name: "JGetfileTool",
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
