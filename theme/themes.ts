import * as R from 'ramda'
import {defaultTheme as xstyled} from '@agriffis/xstyled-styled-components'

const mapObj = R.curry((fn, obj) =>
  R.compose(R.fromPairs, R.map(fn), R.toPairs)(obj),
)

const compressFractionalKeys = mapObj(([k, v]) => [k.replace(/[.]/g, ''), v])

const containerRem = 36 // 576px

export const _light = {
  media: {
    container: `(min-width: ${containerRem * 16}px)`,
    desktop: '(min-width: 740px)',
    bigger: '(min-width: 820px)',
    biggest: '(min-width: 900px)',
  },
  theme: {
    colors: {
      background: '#fff',
      text: '#555',
      heading: '#444',
      icon: '#333',
      accent: '#246eb9',
      link: '#246eb9',
      note: '#ddd',
    },
    fonts: {
      mono: '"Roboto Mono", monospace',
      sans: '"Roboto Condensed", sans-serif',
      serif: '"Crimson Pro", serif',
      meta: '$sans',
    },
    fontSizes: {
      metaLg: '1.25rem',
      metaSm: '0.75rem',
    },
    fontWeights: {
      ...xstyled.fontWeights,
    },
    sizes: {
      ...compressFractionalKeys(xstyled.sizes),
      container: `${containerRem}rem`,
      logo: '100px',
    },
    space: {
      ...compressFractionalKeys(xstyled.space),
      pagePadding: '$4',
      gutter: '$8',
    },
  },
}

export const _dark = {
  colors: {
    background: '#111',
    text: '#ccc',
    heading: '#ddd',
    accent: '#76c2fb',
    icon: '#ccc',
    link: '#76c2fb',
    note: '#444',
  },
}
