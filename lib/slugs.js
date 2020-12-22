import fs from 'fs'
import path from 'path'
import {slugDateRe} from './utils'

const root = process.cwd()
const contentDir = path.join(root, 'content')

export function pathToSlug(name) {
  return path.basename(name, '.mdx')
}

export function slugToPath(slug) {
  return path.join(contentDir, `${slug}.mdx`)
}

export function getSlugs() {
  const contentFiles = fs.readdirSync(contentDir)
  const postFiles = contentFiles.filter(p => slugDateRe.test(p))
  return postFiles.map(pathToSlug).sort().reverse()
}

export {slugDateRe}
