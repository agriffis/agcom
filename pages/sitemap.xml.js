import globby from 'globby'
import * as site from 'lib/site'
import {escapeXml as ex} from 'lib/utils'
import {getSlugs} from 'lib/utils-node'

export default function dummy() {
  // nothing happens here, it's all in getServerSideProps
}

function sitemapXml({baseUrl, routes}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      r => `<url>
    <loc>${ex(`${baseUrl}${r}`)}</loc>
  </url>`,
    )
    .join('\n  ')}
</urlset>`
}

export async function getServerSideProps({res}) {
  const pages = await globby([
    'pages/**/*.js',
    '!pages/**/_*',
    '!pages/**/*\\[*',
    '!pages/**/*.xml.js',
    '!pages/api',
  ])

  const slugs = getSlugs()

  const routes = pages
    .map(page => {
      const path = page.replace('pages', '').replace(/\.js$/, '')
      return path === '/index' ? '' : path
      return `${baseUrl}${route}`
    })
    .concat(slugs.map(slug => '/' + slug))

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'max-age=3600, public, immutable')
  res.write(
    sitemapXml({
      baseUrl: site.BASE_URL,
      routes,
    }),
  )
  res.end()

  return {props: {}}
}
