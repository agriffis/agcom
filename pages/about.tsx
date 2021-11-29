import {MDXRemote} from 'next-mdx-remote'
import * as components from 'components/post'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {Page} from 'components/Page'
import {S} from 'components'
import {getPageProps, renderMdx} from 'lib/utils-node'

export default function About({frontMatter, mdxSource, ...pageProps}) {
  return (
    <Page {...frontMatter} {...pageProps}>
      <S.Markdown
        as="article"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <MDXRemote {...mdxSource} components={components} />
      </S.Markdown>
    </Page>
  )
}

export async function getStaticProps({params}) {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'content/about.mdx'),
    'utf8',
  )
  const {data, content} = matter(source)
  const mdxSource = await renderMdx(content, data)
  return {props: {frontMatter: data, mdxSource, ...getPageProps()}}
}
