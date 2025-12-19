import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium({
      cesiumBaseUrl: 'cesium',
    }),
    (monacoEditorPlugin as any).default ? (monacoEditorPlugin as any).default({}) : monacoEditorPlugin({})
  ],
  base: '/GothicGIS/',
})
