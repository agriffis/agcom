import {MDXRemote} from 'next-mdx-remote'
import * as mdx from 'components/mdx'
import {Page} from 'components/Page'
import {getSlugs} from 'lib/slugs'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'
import {getPageProps, getPostProps} from 'lib/utils-node'
import {ComponentProps} from 'react'

interface BlogPostProps extends ComponentProps<typeof Page> {
  data: object
  mdxSource: Omit<ComponentProps<typeof MDXRemote>, 'components'>
  slug: string
}

export default function BlogPost({
  data,
  mdxSource,
  slug,
  ...props
}: BlogPostProps) {
  const matter = enrichFrontMatter({data, slug})
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
      <article itemScope itemType="https://schema.org/CreativeWork">
        <MDXRemote {...mdxSource} components={mdx} />
      </article>
    </Page>
  )
}

export async function getStaticPaths() {
  const slugs = await getSlugs()
  return {
    fallback: false,
    paths: slugs.map(slug => ({params: {slug}})),
  }
}

export async function getStaticProps({params: {slug}}) {
  const pageProps = getPageProps()
  const postProps = await getPostProps(slug)
  return {props: {...pageProps, ...postProps}}
}
