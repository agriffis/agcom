import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {Page} from '../../components'

const root = process.cwd()
const blogContent = path.join(root, 'content/blog')

export default function BlogPost({mdxSource, frontMatter}) {
  const content = hydrate(mdxSource)
  return (
    <Page>
      <h1>{frontMatter.title}</h1>
      {content}
    </Page>
  )
}

export async function getStaticPaths() {
  return {
    fallback: false,
    paths: fs
      .readdirSync(blogContent)
      .map(p => ({params: {slug: p.replace(/\.mdx/, '')}})),
  }
}

export async function getStaticProps({params}) {
  const source = fs.readFileSync(
    path.join(blogContent, `${params.slug}.mdx`),
    'utf8',
  )
  const {data, content} = matter(source)
  const mdxSource = await renderToString(content)
  return {props: {mdxSource, frontMatter: data}}
}
