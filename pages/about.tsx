import {MDXRemote} from 'next-mdx-remote'
import {Markdown, mdx as mdxComponents} from 'components'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {Page} from 'components/Page'
import {getPageProps, renderMdx} from 'lib/utils-node'

export default function About({frontMatter, mdxSource, ...pageProps}) {
  return (
    <Page {...frontMatter} {...pageProps}>
      <Markdown
        as="article"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <MDXRemote {...mdxSource} components={mdxComponents} />
      </Markdown>
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
