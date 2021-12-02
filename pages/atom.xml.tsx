import * as site from 'lib/site'
import {isoDate, escapeXml as ex} from 'lib/utils'
import {getRssProps} from 'lib/utils-node'

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

interface entryXmlProps {
  blogUrl: string
  post: {
    markup: string
    matter: {
      created: Date
      updated?: Date
      title: string
    }
    slug: string
  }
}

function entryXml({blogUrl, post: {markup, matter, slug}}: entryXmlProps) {
  const link = `${blogUrl}/${slug}`
  const created = matter.created.toUTCString()
  const updated = matter.updated?.toUTCString()
  const copyright = (matter.updated || matter.created).getUTCFullYear()
  return `<entry>
      <id>${ex(link)}</id>
      <title>${ex(matter.title || '')}</title>
      <link href="${ex(link)}" />
      <published>${ex(created)}</published>
      <rights>Copyright ${copyright} Aron Griffis</rights>
      ${(updated || '') && `<updated>${ex(updated)}</updated>`}
      <content>${ex(markup)}</content>
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
