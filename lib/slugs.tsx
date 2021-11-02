import * as fs from 'fs/promises'
import path from 'path'
import {slugDateRe} from './utils'

const root = process.cwd()
const contentDir = path.join(root, 'content')

export function pathToSlug(name: string) {
  return path.basename(name, '.mdx')
}

export function slugToPath(slug: string) {
  return path.join(contentDir, `${slug}.mdx`)
}

export async function getSlugs() {
  const paths = await fs.readdir(contentDir)
  return paths
    .filter((p: string) => slugDateRe.test(p))
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
