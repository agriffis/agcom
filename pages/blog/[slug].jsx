import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {MyImage, Page} from '../../components'

const components = {MyImage}

const root = process.cwd()
const blogContent = path.join(root, 'content/blog')

export default function BlogPost({mdxSource, frontMatter}) {
  const content = hydrate(mdxSource, {components})
  return (
    <Page>
      <article itemscope itemtype="http://schema.org/CreativeWork">
        <header>
          <h1>{frontMatter.title}</h1>
          {frontMatter.subTitle &&
          <h2>{frontMatter.subTitle}</h2>}
          {/*
          <div className="post-meta">
            {% if page.date %}
            <time datetime="{{page.date|date_to_xmlschema}}"
              itemprop="datePublished">{{page.date|date:'%b %d, %Y'}}</time>
            {% endif %}
            {% if page.last_modified_at and page.last_modified_at != page.date %}
            (updated: <time datetime="{{page.last_modified_at|date_to_xmlschema}}"
              itemprop="dateModified">{{page.last_modified_at|date:'%b %d, %Y'}}</time>)
            {% endif %}
          </div>
          */}
        </header>
        <div className="post-markdown">
          {content}
        </div>
      </article>
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
  const mdxSource = await renderToString(content, {components})
  return {props: {mdxSource, frontMatter: data}}
}
