import * as site from 'lib/site'
import {isoDate, escapeXml as ex, cdata} from 'lib/utils'
import {getRssProps} from 'lib/utils-node'

export default function dummy() {
  // nothing happens here, it's all in getServerSideProps
}

function rssXml({blogUrl, lastUpdated, posts}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${ex(site.TITLE)}</title>
    <link>${ex(blogUrl)}</link>
    <description>Aron's Blog</description>
    <lastBuildDate>${ex(lastUpdated.toUTCString())}</lastBuildDate>
    <pubDate>${ex(lastUpdated.toUTCString())}</pubDate>
    <docs>https://cyber.harvard.edu/rss/rss.html</docs>
    ${posts.map(post => postXml({blogUrl, post})).join('\n    ')}
  </channel>
</rss>`
}

function postXml({
  blogUrl,
  post: {
    matter,
    mdxSource: {renderedOutput},
    slug,
  },
}) {
  const link = `${blogUrl}/${slug}`
  return `<item>
      <title>${ex(matter.title)}</title>
      <link>${ex(link)}</link>
      <guid isPermaLink="true">${ex(link)}</guid>
      <pubDate>${ex(matter.created.toUTCString())}</pubDate>
      <description>${cdata(renderedOutput)}</description>
    </item>`
}

export async function getServerSideProps({res}) {
  const rssProps = await getRssProps()

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'max-age=3600, public, immutable')
  res.write(rssXml(rssProps))
  res.end()

  return {props: {}}
}
