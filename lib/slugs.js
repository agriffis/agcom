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
  return fs
    .readdirSync(contentDir)
    .filter(p => slugDateRe.test(p))
    .filter(
      process.env.NODE_ENV === 'development'
        ? () => true
        : p => p.startsWith('2'),
    )
    .map(pathToSlug)
    .sort()
    .reverse()
}

export {slugDateRe}
