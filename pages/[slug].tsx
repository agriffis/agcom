import hydrate from 'next-mdx-remote/hydrate'
import * as components from 'components'
import {Page} from 'components/Page'
import {getSlugs} from 'lib/slugs'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'
import {getPageProps, getPostProps} from 'lib/utils-node'
import {ComponentProps} from 'react'

interface BlogPostProps extends ComponentProps<typeof Page> {
  data: object
  mdxSource: Parameters<typeof hydrate>[0]
  slug: string
}

export default function BlogPost({
  data,
  mdxSource,
  slug,
  ...props
}: BlogPostProps) {
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
