import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import {Page} from 'components/Page'
import {getIndex, getPageProps, renderMdx} from 'lib/utils-node'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'

export default function Home({frontMatter, mdxSource, posts, ...pageProps}) {
  const content = hydrate(mdxSource)
  return (
    <Page {...frontMatter} {...pageProps}>
      {content}
      <ul className="posts-index">
        {posts.map(post => {
          const matter = enrichFrontMatter(post)
          return (
            <li key={post.slug} className="post-listing">
              <header className="post-header">
                <h1 className="h3">
                  <Link href={`/${post.slug}`}>
                    <a>{matter.title}</a>
                  </Link>
                </h1>
              </header>
              {matter.excerpt && (
                <p className="post-excerpt">{matter.excerpt}</p>
              )}
              <footer className="post-meta">
                <time dateTime={isoDate(matter.created)}>
                  {shortDate(matter.created)}
                </time>
                {matter.updated && (
                  <>
                    {' (updated: '}
                    <time dateTime={isoDate(matter.updated)}>
                      {shortDate(matter.updated)}
                    </time>
                    )
                  </>
                )}
              </footer>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}

export async function getStaticProps({params}) {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'content/home.mdx'),
    'utf8',
  )
  const {data, content} = matter(source)
  const mdxSource = await renderMdx(content, data)
  const posts = await getIndex()
  return {props: {frontMatter: data, mdxSource, posts, ...getPageProps()}}
}
