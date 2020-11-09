import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import type { RollupOptions } from 'rollup';
import { terser, Options } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const terserConfig = (minify: boolean): Options => {
  return minify
    ? {
        mangle: true,
        module: false,
        format: {
          beautify: false,
          comments: false,
          ecma: 2020
        }
      }
    : {
        compress: {
          /* eslint-disable camelcase */
          dead_code: true
        },
        format: {
          beautify: true,
          comments: true,
          ecma: 2020,
          indent_level: 2
        },
        module: true,
        mangle: false
      };
};

/** @type {import('rollup').RollupOptions} */
const option: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/mobx-react-router.js',
      format: 'umd',
      preferConst: true,
      sourcemap: true,
      name: 'MobxReactRouter',
      plugins: [terser(terserConfig(false))]
    },
    {
      file: 'dist/mobx-react-router.min.js',
      format: 'umd',
      preferConst: true,
      sourcemap: true,
      name: 'MobxReactRouter',
      plugins: [terser(terserConfig(true))]
    },
    {
      dir: 'lib',
      banner: '/* eslint-disable */',
      format: 'cjs',
      preferConst: true,
      sourcemap: true,
      plugins: [terser(terserConfig(false))]
    },
    {
      dir: 'module',
      banner: '/* eslint-disable */',
      format: 'module',
      preferConst: true,
      sourcemap: true,
      plugins: [terser(terserConfig(false))]
    }
  ],
  external: [
    'history',
    'mobx'
  ],

  plugins: [
    nodeResolve({
      extensions,
      preferBuiltins: true
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['react-app'],
      extensions
    }),
    commonjs()
  ]
};

export default option;
