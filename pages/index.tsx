import {MDXRemote} from 'next-mdx-remote'
import * as mdx from 'components/mdx'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import {Page} from 'components/Page'
import {S} from 'components'
import {getIndex, getPageProps, renderMdx} from 'lib/utils-node'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'

export default function Home({frontMatter, mdxSource, posts, ...pageProps}) {
  return (
    <Page {...frontMatter} {...pageProps}>
      <MDXRemote {...mdxSource} components={mdx} />
      <S.Posts>
        {posts.map(post => {
          const matter = enrichFrontMatter(post)
          return (
            <S.Posts.Item key={post.slug}>
              <S.Posts.Header>
                <h1 className="h3">
                  <Link href={`/${post.slug}`}>
                    <a>{matter.title}</a>
                  </Link>
                </h1>
              </S.Posts.Header>
              {matter.excerpt && <S.Posts.Excerpt children={matter.excerpt} />}
              <S.Posts.Footer>
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
              </S.Posts.Footer>
            </S.Posts.Item>
          )
        })}
      </S.Posts>
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
