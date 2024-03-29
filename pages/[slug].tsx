import dynamic from 'next/dynamic'
import {MDXRemote} from 'next-mdx-remote'
import {Markdown, mdx as mdxComponents} from 'components'
import {Page} from 'components/Page'
import {getSlugs} from 'lib/slugs'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'
import {getPageProps, getPostProps} from 'lib/utils-node'
import {ComponentProps} from 'react'

const dynamicMdxComponents = {
  Advent: dynamic(() => import('components/Advent')),
}

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
      <Markdown
        as="article"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <MDXRemote
          {...mdxSource}
          components={{...mdxComponents, ...dynamicMdxComponents}}
        />
      </Markdown>
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
