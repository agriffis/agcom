import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {enrichFrontMatter, slugDateRe} from './utils'

const root = process.cwd()
const contentDir = path.join(root, 'content')

const pathToSlug = name => path.basename(name, '.mdx')

const slugToPath = slug => path.join(contentDir, `${slug}.mdx`)

export const getPostSource = slug => fs.readFileSync(slugToPath(slug), 'utf8')

export const getSlugs = () => {
  const contentFiles = fs.readdirSync(contentDir)
  const postFiles = contentFiles.filter(p => slugDateRe.test(p))
  return postFiles.map(pathToSlug).sort().reverse()
}

export const getPosts = () => {
  return getSlugs().map(slug => {
    const content = getPostSource(slug)
    const {data} = matter(content)
    return {content, data, slug}
  })
}
