import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',

  output: {
    file: './dist/upload-file-utils.js',
    format: 'umd',
    name: 'Uploader'
  },
  
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
}