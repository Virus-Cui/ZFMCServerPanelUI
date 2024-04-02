import {fileURLToPath, URL} from 'node:url'

// import monacoEditorPlugin from 'vite-plugin-monaco-editor'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    server:{
        watch:{
            usePolling: true,
        },
        hmr: true
    },
    plugins: [
        vue(),
        // monacoEditorPlugin({
        // })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
