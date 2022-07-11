import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'
import visualizer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/styles/var.less";',
        javascriptEnabled: true,
      }
    }
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        '@ant-design/charts',
        '@ant-design/plots',
        '@ant-design/flowchart',
        '@ant-design/icons',
        '@emotion/core',
        '@emotion/css',
        '@terminus/jarvisplus',
        'antd',
        '@antv/g2plot',
        'assert',
        'classnames',
        'dayjs',
        'highlight.js',
        'highlight.js/lib/languages/sql',
        'lodash',
        'memoize-one',
        'qrcode.react',
        'query-string',
        'ramda',
        // 'react',
        'react-color',
        // 'react-dom',
        'react-grid-layout',
        'react-router-dom',
        'react-sizeme',
        'react-svg',
        'superagent'
      ]
    }
  }
})
