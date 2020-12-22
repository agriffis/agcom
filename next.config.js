const {getSlugs} = require('./slugs')

module.exports = {
  async redirects() {
    return getSlugs().map(slug => ({
      source: '/' + slug.replace('-', '/').replace('-', '/').replace('-', '/'),
      destination: '/' + slug,
      permanent: true,
    }))
  },
}
