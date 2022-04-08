// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
      name: 'cjs'
    },
    {
      file: 'es/index.js',
      format: 'esm',
      name: 'esm'
    }
  ],
  plugins: [typescript()]
};