import * as site from '../site'
import {isoDate, escapeXml as ex, cdata} from '../utils'
import {getRssProps} from '../utils-node'

export default function dummy() {
  // nothing happens here, it's all in getServerSideProps
}

function atomXml({blogUrl, lastUpdated, posts}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${ex(blogUrl)}</id>
  <title>${ex(site.TITLE)}</title>
  <updated>${isoDate(lastUpdated)}</updated>
  <author>
    <name>Aron Griffis</name>
    <uri>${ex(blogUrl)}</uri>
    <email>${ex(site.EMAIL)}</email>
  </author>
  <link rel="alternate" href="${ex(blogUrl)}" />
  <link rel="self" href="${ex(blogUrl)}/atom.xml" />
  ${posts.map(post => entryXml({blogUrl, post})).join('\n    ')}
</feed>`
}

function entryXml({
  blogUrl,
  post: {
    matter,
    mdxSource: {renderedOutput},
    slug,
  },
}) {
  const link = `${blogUrl}/${slug}`
  const created = matter.created.toUTCString()
  const updated = matter.updated?.toUTCString()
  const copyright = (matter.updated || matter.created).getUTCFullYear()
  return `<entry>
      <id>${ex(link)}</id>
      <title>${ex(matter.title)}</title>
      <link href="${ex(link)}" />
      <published>${ex(created)}</published>
      <rights>Copyright ${copyright} Aron Griffis</rights>
      ${(updated || '') && `<updated>${ex(updated)}</updated>`}
      <content>${ex(renderedOutput)}</content>
    </entry>`
}

export async function getServerSideProps({res}) {
  const rssProps = await getRssProps()

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'max-age=3600, public, immutable')
  res.write(atomXml(rssProps))
  res.end()

  return {props: {}}
}
