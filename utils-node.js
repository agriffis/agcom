import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import smartypants from '@silvenon/remark-smartypants'
import * as components from './components'
import {enrichFrontMatter, slugDateRe} from './utils'

const root = process.cwd()
const contentDir = path.join(root, 'content')

const pathToSlug = name => path.basename(name, '.mdx')

const slugToPath = slug => path.join(contentDir, `${slug}.mdx`)

export function getPostSource(slug) {
  return fs.readFileSync(slugToPath(slug), 'utf8')
}

export function getSlugs() {
  const contentFiles = fs.readdirSync(contentDir)
  const postFiles = contentFiles.filter(p => slugDateRe.test(p))
  return postFiles.map(pathToSlug).sort().reverse()
}

export function getIndex() {
  return getSlugs().map(slug => {
    const content = getPostSource(slug)
    const {data} = matter(content)
    return {data, slug}
  })
}

export async function getPostProps(slug) {
  const source = getPostSource(slug)
  const {data, content} = matter(source)
  const mdxSource = await renderToString(content, {
    components,
    mdxOptions: {remarkPlugins: [smartypants]},
  })
  return {data, mdxSource, slug}
}

export const getDeployDate = () => {
  const stats = fs.lstatSync(path.join(root, 'node_modules'))
  return stats.birthtime
}
