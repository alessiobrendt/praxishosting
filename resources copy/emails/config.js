/**
 * Maizzle base config – shared by all environments.
 * Production overrides in config.production.js
 */
export default {
  build: {
    content: ['templates/**/*.html'],
    output: {
      path: 'build_local',
      from: ['templates'],
    },
  },
  inlineCSS: true,
  removeUnusedCSS: true,
  shorthandCSS: true,
  minify: {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  },
}
