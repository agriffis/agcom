import * as site from '../site'
import {enrichFrontMatter, isoDate, escapeXml as ex, cdata} from '../utils'
import {getDeployDate, getSlugs, getPostProps} from '../utils-node'

export default function dummy() {
  // nothing happens here, it's all in getServerSideProps
}

function atomXml({blogUrl, deployDate, posts}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${ex(blogUrl)}</id>
  <title>${ex(site.TITLE)}</title>
  <updated>${isoDate(deployDate)}</updated>
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
    data,
    mdxSource: {renderedOutput},
    slug,
  },
}) {
  const pm = enrichFrontMatter({data, slug})
  const link = `${blogUrl}/${pm.slug}`
  const created = pm.created.toUTCString()
  const updated = pm.updated?.toUTCString()
  const copyright = (pm.updated || pm.created).getUTCFullYear()
  return `<entry>
      <id>${ex(link)}</id>
      <title>${ex(pm.title)}</title>
      <link href="${ex(link)}" />
      <published>${ex(created)}</published>
      <rights>Copyright ${copyright} Aron Griffis</rights>
      ${(updated || '') && `<updated>${ex(updated)}</updated>`}
      <content>${ex(renderedOutput)}</content>
    </entry>`
}

export async function getServerSideProps({res}) {
  const slugs = getSlugs()

  const posts = await Promise.all(
    slugs.map(slug =>
      getPostProps(slug).catch(e => {
        console.error(`Failed rendering ${slug}`)
        throw e
      }),
    ),
  )

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'max-age=3600, public, immutable')
  res.write(
    atomXml({
      blogUrl: site.BASE_URL,
      deployDate: getDeployDate(),
      posts,
    }),
  )
  res.end()

  return {props: {}}
}
