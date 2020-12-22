#!/usr/bin/env node

const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true})
const path = require('path')
const util = require('util')

const root = process.cwd()
const imagesDir = path.join(root, 'public/img')
const imagesBase = '/img'

async function main() {
  const images = await util.promisify(fs.readdir)(imagesDir)
  images.sort()

  const pairs = await Promise.all(
    images.map(
      img =>
        new Promise((resolve, reject) => {
          gm(path.join(imagesDir, img)).size((err, size) => {
            if (err) {
              reject(err)
            } else {
              resolve([img, {src: path.join(imagesBase, img), ...size}])
            }
          })
        }),
    ),
  )

  const infos = Object.fromEntries(pairs)

  process.stdout.write(JSON.stringify(infos, null, 2))
}

main()
