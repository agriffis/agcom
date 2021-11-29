import {MDXRemote} from 'next-mdx-remote'
import {Markdown, mdx as mdxComponents} from 'components'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {Page} from 'components/Page'
import {Link, Posts} from 'components'
import {getIndex, getPageProps, renderMdx} from 'lib/utils-node'
import {enrichFrontMatter, isoDate, shortDate} from 'lib/utils'

export default function Home({frontMatter, mdxSource, posts, ...pageProps}) {
  return (
    <Page {...frontMatter} {...pageProps}>
      <Markdown
        as="article"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <MDXRemote {...mdxSource} components={mdxComponents} />
      </Markdown>
      <Posts>
        {posts.map(post => {
          const matter = enrichFrontMatter(post)
          return (
            <Posts.Item key={post.slug}>
              <Posts.Header>
                <h1 className="h3">
                  <Link href={`/${post.slug}`}>{matter.title}</Link>
                </h1>
              </Posts.Header>
              {matter.excerpt && <Posts.Excerpt children={matter.excerpt} />}
              <Posts.Footer>
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
              </Posts.Footer>
            </Posts.Item>
          )
        })}
      </Posts>
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
