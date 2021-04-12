import hydrate from 'next-mdx-remote/hydrate'
import * as components from 'agcom/components'
import {Page} from 'agcom/components/Page'
import {getSlugs} from 'agcom/lib/slugs'
import {enrichFrontMatter, isoDate, shortDate} from 'agcom/lib/utils'
import {getPageProps, getPostProps} from 'agcom/lib/utils-node'

export default function BlogPost({data, mdxSource, slug, ...props}) {
  const matter = enrichFrontMatter({data, slug})
  const content = hydrate(mdxSource, {components})
  const meta = (
    <>
      <time dateTime={isoDate(matter.created)} itemProp="datePublished">
        {shortDate(matter.created)}
      </time>
      {matter.updated && (
        <>
          {' (updated: '}
          <time dateTime={isoDate(matter.updated)} itemProp="dateModified">
            {shortDate(matter.updated)}
          </time>
          )
        </>
      )}
    </>
  )
  return (
    <Page {...matter} {...props} postMeta={meta}>
      <article itemScope itemType="http://schema.org/CreativeWork">
        <div className="post-markdown">{content}</div>
      </article>
    </Page>
  )
}

export async function getStaticPaths() {
  return {
    fallback: false,
    paths: getSlugs().map(slug => ({params: {slug}})),
  }
}

export async function getStaticProps({params: {slug}}) {
  const pageProps = getPageProps()
  const postProps = await getPostProps(slug)
  return {props: {...pageProps, ...postProps}}
}
