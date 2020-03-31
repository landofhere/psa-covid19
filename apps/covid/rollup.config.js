require('dotenv').config()
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import image from 'svelte-image'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import remark from 'remark'
import html from 'remark-html'
import svg from 'rollup-plugin-svg'
import path from 'path'

import pkg from './package.json'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

const markdown = () => ({
  transform(md, id) {
    if (!/\.md$/.test(id)) return null
    const data = remark()
      .use(html)
      .process(md, (err, file) => String(file))
    return {
      code: `export default ${JSON.stringify(data)};`,
    }
  },
})

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      copy({
        targets: [
          {
            src: [
              path.resolve(
                '../../node_modules/@openfonts/source-sans-pro_latin/files',
              ),
              path.resolve(
                '../../node_modules/@openfonts/source-sans-pro_latin/index.css',
              ),
            ],
            dest: 'static',
          },
        ],
        resolve: true,
      }),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.GEOCODING_API_KEY': dev
          ? JSON.stringify(process.env.GOOGLE_GEOCODING_API_TEST)
          : JSON.stringify(process.env.GOOGLE_GEOCODING_API),
        'process.env.CA_COUNTY_URL': JSON.stringify(process.env.CA_COUNTY_URL),
        'process.env.CA_COUNTY_URL_V2': JSON.stringify(
          process.env.CA_COUNTY_URL_V2,
        ),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.API_CA_COUNTY_FILE': JSON.stringify(
          process.env.API_CA_COUNTY_FILE,
        ),
      }),
      svg(),
      svelte({
        dev,
        hydratable: true,
        emitCss: false,
        preprocess: {
          ...image({
            trace: {
              background: '#fff',
              color: '#C0D0D1',
              threshold: 180,
            },
          }),
        },
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      json({
        compact: true,
      }),
      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          runtimeHelpers: true,
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],
    // context: "window",
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.SITE_URL':
          process.env.NODE_ENV === 'development'
            ? `'${process.env.SITE_URL}'`
            : `'${process.env.PROD_URL}'`,
        'process.env.GEOCODING_API_KEY': dev
          ? JSON.stringify(process.env.GOOGLE_GEOCODING_API_TEST)
          : JSON.stringify(process.env.GOOGLE_GEOCODING_API),
        'process.env.CA_COUNTY_URL': JSON.stringify(process.env.CA_COUNTY_URL),
        'process.env.CA_COUNTY_URL_V2': JSON.stringify(
          process.env.CA_COUNTY_URL_V2,
        ),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.API_CA_COUNTY_FILE': JSON.stringify(
          process.env.API_CA_COUNTY_FILE,
        ),
      }),
      svg(),
      svelte({
        generate: 'ssr',
        dev,
        hydratable: true,
        preprocess: {
          ...image(),
        },
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      markdown(),
      json(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives')),
    ),
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.SITE_URL':
          process.env.NODE_ENV === 'development'
            ? `'${process.env.SITE_URL}'`
            : `'${process.env.PROD_URL}'`,
        'process.env.GEOCODING_API_KEY': dev
          ? JSON.stringify(process.env.GOOGLE_GEOCODING_API_TEST)
          : JSON.stringify(process.env.GOOGLE_GEOCODING_API),
        'process.env.CA_COUNTY_URL': JSON.stringify(process.env.CA_COUNTY_URL),
        'process.env.CA_COUNTY_URL_V2': JSON.stringify(
          process.env.CA_COUNTY_URL_V2,
        ),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.API_CA_COUNTY_FILE': JSON.stringify(
          process.env.API_CA_COUNTY_FILE,
        ),
      }),
      commonjs(),
      !dev && terser(),
    ],
    onwarn,
  },
}
