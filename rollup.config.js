import path from 'path'
import buble from 'rollup-plugin-buble'
import svelte from 'rollup-plugin-svelte'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import sass from 'rollup-plugin-sass'
import commonjs from 'rollup-plugin-commonjs'

import autoPreprocess from 'svelte-preprocess'

const PKG_DIR = 'packages/@st-graphics'

const packages = [
  'scrolly',
  'video-scrolly',
  'object-fit-video'
]

export default [
  ...packages.map(createVueBuild),
  ...packages.map(createReactBuild),
  createSvelteBuild(packages[0])
]

function createVueBuild (pkg) {
  return {
    input: path.join(PKG_DIR, pkg, 'src/index.vue'),
    output: [{
      format: 'esm',
      file: path.join(PKG_DIR, pkg, 'dist/index.js'),
      sourcemap: true
    }, {
      format: 'cjs',
      file: path.join(PKG_DIR, pkg, 'dist/legacy.js'),
      sourcemap: true
    }],
    plugins: [
      css({output: path.join(PKG_DIR, pkg, 'dist/bundle.css')}),
      vue({css: false}),
      buble(),
      commonjs()
    ]
  }
}

function createReactBuild (pkg) {
  pkg = 'react-' + pkg
  return {
    external: [
      'react',
      'prop-types',
      'classnames'
    ],
    input: path.join(PKG_DIR, pkg, 'src/index.jsx'),
    output: [{
      format: 'esm',
      file: path.join(PKG_DIR, pkg, 'dist/index.js'),
      sourcemap: true
    }, {
      format: 'cjs',
      file: path.join(PKG_DIR, pkg, 'dist/legacy.js'),
      sourcemap: true
    }],
    plugins: [
      sass({output: path.join(PKG_DIR, pkg, 'dist/bundle.css')}),
      buble({objectAssign: 'Object.assign'})
    ]
  }
}

function createSvelteBuild (pkg) {
  pkg = 'svelte-' + pkg
  return {
    external: [
      'svelte',
      'svelte/internal'
    ],
    input: path.join(PKG_DIR, pkg, 'src/index.svelte'),
    output: [{
      format: 'esm',
      file: path.join(PKG_DIR, pkg, 'dist/index.js'),
      sourcemap: true
    }, {
      format: 'cjs',
      file: path.join(PKG_DIR, pkg, 'dist/legacy.js'),
      sourcemap: true
    }],
    plugins: [
      css({output: path.join(PKG_DIR, pkg, 'dist/bundle.css')}),
      svelte({
        emitCss: true,
        preprocess: autoPreprocess()
      }),
      buble()
    ]
  }
}
