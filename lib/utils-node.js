import * as R from 'ramda'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import remarkPants from '@silvenon/remark-smartypants'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeToc from '@jsdevtools/rehype-toc'
import select from 'hast-util-select'
import visit from 'unist-util-visit'
import * as components from 'components'
import * as site from './site'
import {slugToPath, getSlugs} from './slugs'
import {enrichFrontMatter, slugDateRe} from './utils'

export function getPostSource(slug) {
  return fs.readFileSync(slugToPath(slug), 'utf8')
}

export function getIndex() {
  return getSlugs().map(slug => {
    const content = getPostSource(slug)
    const {data} = matter(content)
    return {data, slug}
  })
}

/**
 * Just the class-setting part of
 * https://kramdown.gettalong.org/syntax.html#inline-attribute-lists
 */
function rehypeInlineAttributeLists() {
  return (tree, file) => {
    visit(tree, node => {
      if (node.type === 'element') {
        const lastChild = node.children?.slice(-1)[0]
        if (lastChild?.type === 'text') {
          const m = lastChild.value.match(/\s*\{:\.(\S+)\}$/)
          if (m) {
            lastChild.value = lastChild.value.substring(0, m.index)
            node.properties.className = `${node.properties.className || ''} ${
              m[1]
            }`
          }
        }
      }
    })
  }
}

export async function renderMdx(content, data) {
  return await renderToString(content, {
    components,
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
                        return R.assoc('children', [ol], toc)
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
  })
}

export async function getPostProps(slug) {
  const source = getPostSource(slug)
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
  const slugs = getSlugs()

  const posts = await Promise.all(
    slugs.map(slug =>
      getPostProps(slug)
        .then(post => ({...post, matter: enrichFrontMatter(post)}))
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
