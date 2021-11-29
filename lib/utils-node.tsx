import ReactDOMServer from 'react-dom/server'
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypePrism from '@mapbox/rehype-prism'
import remarkPants from '@silvenon/remark-smartypants'
import * as components from 'components/post'
import * as fs from 'fs/promises'
import matter from 'gray-matter'
import select from 'hast-util-select'
import {MDXRemote} from 'next-mdx-remote'
import {serialize} from 'next-mdx-remote/serialize'
import rehypeSlug from 'rehype-slug'
import * as unist from 'unist'
import visit from 'unist-util-visit'
import * as site from './site'
import {slugToPath, getSlugs} from './slugs'
import {enrichFrontMatter} from './utils'

export async function getPostSource(slug: string) {
  return fs.readFile(slugToPath(slug))
}

export async function getIndex() {
  const slugs = await getSlugs()
  const sources = await Promise.all(slugs.map(getPostSource))
  return slugs.map((slug, i) => {
    const {data} = matter(sources[i])
    return {data, slug}
  })
}

/**
 * See https://github.com/syntax-tree/unist-util-visit/issues/15
 */
interface RehypeElement extends unist.Parent {
  type: 'element'
  tagName: string
  properties: {
    [key: string]: unknown
  }
  content: unist.Node
  children: unist.Node[]
}

interface RehypeText extends unist.Node {
  type: 'text'
  value: string
}

const isNode = (node: unknown): node is unist.Node =>
  typeof node === 'object' && 'type' in node

const elementTest = (node: unknown): node is RehypeElement =>
  isNode(node) && node.type === 'element'

const textTest = (node: unknown): node is RehypeText =>
  isNode(node) && node.type === 'text'

/**
 * Just the class-setting part of
 * https://kramdown.gettalong.org/syntax.html#inline-attribute-lists
 */
function rehypeInlineAttributeLists() {
  return (tree, file) => {
    visit(tree, elementTest, node => {
      const lastChild = node.children.slice(-1)[0]
      if (textTest(lastChild)) {
        const m = lastChild.value.match(/\s*\{:\.(\S+)\}$/)
        if (m) {
          lastChild.value = lastChild.value.substring(0, m.index)
          node.properties.className = `${node.properties.className || ''} ${
            m[1]
          }`
        }
      }
    })
  }
}

export async function renderMdx(content, data) {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkPants],
      rehypePlugins: [
        rehypeInlineAttributeLists,
        rehypeSlug,
        ...(!data.toc
          ? []
          : [
              [
                rehypeToc,
                {
                  customizeTOC: toc => {
                    if (typeof data.toc === 'string') {
                      const id = '#' + data.toc.replace(/^#/, '')
                      const ol = select.select(`li > a[href="${id}"] + ol`, toc)
                      if (ol) {
                        return {...toc, children: [ol]}
                      }
                    }
                  },
                },
              ],
              () => (tree, file) => {
                const nav = select.select('nav.toc', tree)
                const placeholder = select.select('p.toc-placeholder', tree)
                if (nav && placeholder) {
                  visit(tree, (node, index, parent) => {
                    if (node === nav) {
                      parent.children.splice(index, 1)
                      return [visit.SKIP, index]
                    }
                    if (node === placeholder) {
                      parent.children[index] = nav
                      return visit.SKIP
                    }
                  })
                }
              },
            ]),
        rehypePrism,
      ],
    },
    target: ['es2020'],
  })
}

export async function getPostProps(slug: string) {
  const source = await getPostSource(slug)
  const {data, content} = matter(source)
  const mdxSource = await renderMdx(content, data)
  return {data, mdxSource, slug}
}

export function getPageProps() {
  return {
    vercelEnv: process.env.VERCEL_ENV || null,
    googleAnalyticsId: 'UA-39603016-1',
    googleAnalyticsDomain: 'arongriffis.com',
  }
}

export async function getRssProps() {
  const slugs = await getSlugs()

  const posts = await Promise.all(
    slugs.map(slug =>
      getPostProps(slug)
        .then(({mdxSource, ...post}) => ({
          ...post,
          markup: ReactDOMServer.renderToStaticMarkup(
            <MDXRemote {...mdxSource} components={components} />,
          ),
          matter: enrichFrontMatter(post),
        }))
        .catch(e => {
          console.error(`Failed rendering ${slug}`)
          throw e
        }),
    ),
  )

  const lastUpdated = posts
    .map(({matter: {created, updated}}) => updated || created)
    .sort((a, b) => (a === b ? 0 : a < b ? -1 : 1))
    .slice(-1)[0]

  return {blogUrl: site.BASE_URL, posts, lastUpdated}
}
