export default {
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/:year-:month-:day-:slug',
        permanent: true,
      },
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
    ]
  },
}
