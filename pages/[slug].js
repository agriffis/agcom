import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import smartypants from '@silvenon/remark-smartypants'
import {MyImage, Page} from '../components'
import {enrichFrontMatter, isoDate, shortDate} from '../utils'
import {getPostSource, getSlugs} from '../utils-node'

const components = {MyImage}

export default function BlogPost({data, mdxSource, slug}) {
  const postMatter = enrichFrontMatter({data, slug})
  const content = hydrate(mdxSource, {components})
  return (
    <Page {...postMatter}>
      <article itemscope itemtype="http://schema.org/CreativeWork">
        <header>
          <h1>{postMatter.title}</h1>
          {postMatter.subTitle && <h2>{postMatter.subTitle}</h2>}
          <div className="post-meta">
            <time
              dateTime={isoDate(postMatter.created)}
              itemprop="datePublished"
            >
              {shortDate(postMatter.created)}
            </time>
            {postMatter.updated && (
              <>
                {' (updated: '}
                <time
                  dateTime={isoDate(postMatter.updated)}
                  itemprop="dateModified"
                >
                  {shortDate(postMatter.updated)}
                </time>
                )
              </>
            )}
          </div>
        </header>
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
  const source = getPostSource(slug)
  const {data, content} = matter(source)
  const mdxSource = await renderToString(content, {
    components,
    mdxOptions: {remarkPlugins: [smartypants]},
  })
  return {props: {data, mdxSource, slug}}
}
