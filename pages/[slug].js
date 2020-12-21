import hydrate from 'next-mdx-remote/hydrate'
import {Page} from '../components'
import {enrichFrontMatter, isoDate, shortDate} from '../utils'
import {getPostProps, getSlugs} from '../utils-node'

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
  const props = await getPostProps(slug)
  return {props}
}
