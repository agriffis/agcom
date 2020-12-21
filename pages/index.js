import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import smartypants from '@silvenon/remark-smartypants'
import fs from 'fs'
import path from 'path'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {Page} from '../components'
import {getIndex, getPageProps} from '../utils-node'
import {enrichFrontMatter, isoDate, shortDate} from '../utils'

export default function Home({frontMatter, mdxSource, posts, ...pageProps}) {
  const content = hydrate(mdxSource)
  return (
    <Page {...frontMatter} {...pageProps}>
      {content}
      <h2>Writing</h2>
      {posts.map(post => {
        const postMatter = enrichFrontMatter(post)
        return (
          <article key={post.slug} className="post-listing">
            <header className="post-header">
              <h3 className="post-title">
                <Link href={`/${post.slug}`}>
                  <a>{postMatter.title}</a>
                </Link>
              </h3>
            </header>
            <section>
              <p className="post-excerpt">{postMatter.excerpt}</p>
            </section>
            <footer className="post-meta">
              <time dateTime={isoDate(postMatter.created)}>
                {shortDate(postMatter.created)}
              </time>
              {postMatter.updated && (
                <>
                  {' (updated: '}
                  <time dateTime={isoDate(postMatter.updated)}>
                    {shortDate(postMatter.updated)}
                  </time>
                  )
                </>
              )}
            </footer>
          </article>
        )
      })}
    </Page>
  )
}

export async function getStaticProps({params}) {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'content/home.mdx'),
    'utf8',
  )
  const {data, content} = matter(source)
  const mdxSource = await renderToString(content, {
    mdxOptions: {remarkPlugins: [smartypants]},
  })
  const posts = getIndex()
  return {props: {frontMatter: data, mdxSource, posts, ...getPageProps()}}
}
