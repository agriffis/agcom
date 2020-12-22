import hydrate from 'next-mdx-remote/hydrate'
import * as components from '../components'
import {Page} from '../components'
import {getSlugs} from 'lib/slugs'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'
import {getPageProps, getPostProps} from 'lib/utils-node'

export default function BlogPost({data, mdxSource, slug, ...pageProps}) {
  const postMatter = enrichFrontMatter({data, slug})
  const content = hydrate(mdxSource, {components})
  return (
    <Page {...postMatter} {...pageProps}>
      <article itemScope itemType="http://schema.org/CreativeWork">
        <header>
          <h1>{postMatter.title}</h1>
          {postMatter.subTitle && <h2>{postMatter.subTitle}</h2>}
          <div className="post-meta">
            <time
              dateTime={isoDate(postMatter.created)}
              itemProp="datePublished"
            >
              {shortDate(postMatter.created)}
            </time>
            {postMatter.updated && (
              <>
                {' (updated: '}
                <time
                  dateTime={isoDate(postMatter.updated)}
                  itemProp="dateModified"
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
  const pageProps = getPageProps()
  const postProps = await getPostProps(slug)
  return {props: {...pageProps, ...postProps}}
}
