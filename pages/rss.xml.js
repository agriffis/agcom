import {enrichFrontMatter, isoDate, escapeXml as ex, cdata} from '../utils'
import {getDeployDate, getSlugs, getPostProps} from '../utils-node'

export default function dummy() {
  // nothing happens here, it's all in getServerSideProps
}

function rssXml({blogUrl, deployDate, posts}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Aron Griffis</title>
    <link>${ex(blogUrl)}</link>
    <description>Aron's Blog</description>
    <lastBuildDate>${ex(deployDate.toUTCString())}</lastBuildDate>
    <pubDate>${ex(deployDate.toUTCString())}</pubDate>
    <docs>http://cyber.law.harvard.edu/rss/rss.html</docs>
    ${posts.map(post => postXml({blogUrl, post})).join('\n    ')}
  </channel>
</rss>`
}

function postXml({
  blogUrl,
  post: {
    data,
    mdxSource: {renderedOutput},
    slug,
  },
}) {
  const pm = enrichFrontMatter({data, slug})
  const link = `${blogUrl}/${pm.slug}`
  return `<item>
      <title>${ex(pm.title)}</title>
      <link>${ex(link)}</link>
      <guid isPermaLink="true">${ex(link)}</guid>
      <pubDate>${ex(pm.created.toUTCString())}</pubDate>
      <description>${cdata(renderedOutput)}</description>
    </item>`
}

export async function getServerSideProps({res}) {
  const posts = await Promise.all(
    getSlugs().map(slug =>
      getPostProps(slug).catch(e => {
        console.error(`Failed rendering ${slug}`)
        throw e
      }),
    ),
  )

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'max-age=3600, public, immutable')
  res.write(
    rssXml({
      blogUrl: 'https://arongriffis.com',
      deployDate: getDeployDate(),
      posts,
    }),
  )
  res.end()

  return {props: {}}
}
