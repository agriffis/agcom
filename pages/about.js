import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {Page} from 'components/Page'
import {getPageProps, renderMdx} from 'lib/utils-node'

export default function About({frontMatter, mdxSource, ...pageProps}) {
  const content = hydrate(mdxSource)
  return (
    <Page {...frontMatter} {...pageProps}>
      <article itemScope itemType="http://schema.org/CreativeWork">
        {content}
      </article>
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
