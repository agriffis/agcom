import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {Page} from '../components'

const root = process.cwd()
const blogContent = path.join(root, 'content/blog')

export default function Home({mdxSource, frontMatter, postData}) {
  const content = hydrate(mdxSource)
  return (
    <Page>
      {content}
      <h2>Writing</h2>
      {postData.map(data => (
        <article className="post-listing">
          <header className="post-header">
            <h3 className="post-title">
              <Link href="/blog/[slug]" as={`/blog/${data.slug}`}>
                <a>{data.frontMatter.title}</a>
              </Link>
            </h3>
          </header>
          <section>
            <p className="post-excerpt">{data.frontMatter.excerpt}</p>
          </section>
          {/*
          <footer className="post-meta">
            <time datetime="2020-08-02T00:00:00+00:00">Aug 02, 2020</time>
          </footer>
          */}
        </article>
      ))}
    </Page>
  )
}

export async function getStaticProps({params}) {
  const source = fs.readFileSync(path.join(root, 'content/home.mdx'), 'utf8')
  const {data, content} = matter(source)
  const mdxSource = await renderToString(content)

  const postData = fs.readdirSync(blogContent).map(p => {
    const content = fs.readFileSync(path.join(blogContent, p), 'utf8')
    return {
      slug: p.replace(/\.mdx/, ''),
      content,
      frontMatter: matter(content).data,
    }
  })

  return {props: {mdxSource, frontMatter: data, postData}}
}
