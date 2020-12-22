const fs = require('fs')
const path = require('path')

const {slugDateRe} = require('./utils')

const root = process.cwd()
const contentDir = path.join(root, 'content')

function pathToSlug(name) {
  return path.basename(name, '.mdx')
}

function slugToPath(slug) {
  return path.join(contentDir, `${slug}.mdx`)
}

function getSlugs() {
  const contentFiles = fs.readdirSync(contentDir)
  const postFiles = contentFiles.filter(p => slugDateRe.test(p))
  return postFiles.map(pathToSlug).sort().reverse()
}

module.exports = {
  getSlugs,
  pathToSlug,
  slugDateRe,
  slugToPath,
}
