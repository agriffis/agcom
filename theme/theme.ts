import {defaultTheme as xstyled} from '@agriffis/xstyled-styled-components'

const containerRem = 36 // 576px

export const _theme = {
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
      ...xstyled.sizes,
      container: `${containerRem}rem`,
      logo: '100px',
    },
    space: {
      ...xstyled.space,
      '05': '$0.5',
      15: '$1.5',
      25: '$2.5',
      35: '$3.5',
      pagePadding: '$4',
      gutter: '$8',
    },
  },
}
