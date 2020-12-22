const {getSlugs} = require('./slugs')

module.exports = {
  async redirects() {
    return getSlugs()
      .map(slug => ({
        source:
          '/' + slug.replace('-', '/').replace('-', '/').replace('-', '/'),
        destination: '/' + slug,
        permanent: true,
      }))
      .concat([
        {
          source: '/blog/articles/2012-04-24-dynamic-virtualenvwrapper.html',
          destination: '/2012-04-24-bashrc.virtualenvwrapper',
          permanent: true,
        },
        {
          source: '/blog/articles/2013-03-25-bashes.html',
          destination: '/2013-03-25-bashes',
          permanent: true,
        },
        {
          source: '/blog/articles/2013-08-20-pixel.html',
          destination: '/2013-08-20-pixel',
          permanent: true,
        },
      ])
  },
}
