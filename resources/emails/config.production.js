/**
 * Production build: output compiled HTML into Laravel views for Mailable use.
 * Path is relative to resources/emails/
 */
export default {
  build: {
    content: ['templates/**/*.html'],
    output: {
      path: '../views/emails/compiled',
      from: ['templates'],
    },
    minify: {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
    },
  },
  inlineCSS: true,
  removeUnusedCSS: true,
  shorthandCSS: true,
}
