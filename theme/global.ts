import {normalize} from 'normalize-stitches'

/**
 * CSS reset portions from xstyled's preflight, from
 * https://github.com/gregberge/xstyled/blob/af578429c453aa8445c55a87e984ebaca1d899e7/packages/system/src/preflight.ts
 *
 * This should be installed after normalize, but before site styles.
 */
const preflight = {
  // Role button pointer
  '[role=button], button': {
    cursor: 'pointer',
  },

  // Remove default margins
  'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
    margin: '0',
  },

  // Remove headings styles
  'h1, h2, h3, h4, h5, h6': {
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },

  // Unstyle lists
  'ol, ul': {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },

  // Image are block-level
  'img, svg, video, canvas, audio, iframe, embed, object': {
    display: 'block',
    verticalAlign: 'middle',
  },

  // Reset border styles
  '*, ::before, ::after': {
    borderWidth: '0',
    borderStyle: 'solid',
    borderColor: 'currentColor',
  },
}

const fonts = {
  body: {
    fontFamily: '$serif',
    fontWeight: '$normal',
  },
  'h1, h2, h3': {
    fontFamily: '$sans',
    fontWeight: '$bold',
  },
  'pre, code, kbd, samp, tt': {
    fontFamily: '$mono',
  },
}

const typography = {
  html: {
    fontSize: '18px',
    '@desktop': {fontSize: '16px'},
    '@bigger': {fontSize: '18px'},
    '@biggest': {fontSize: '20px'},
  },
  body: {
    lineHeight: '1.5',
  },
  'h1, .h1': {
    fontSize: '2rem',
    lineHeight: '1.125',
    marginTop: '0',
    marginBottom: '$4',
  },
  'h2, .h2': {
    fontSize: '1.5rem',
    lineHeight: '1.25',
    marginTop: '$10',
    marginBottom: '$4',
  },
  'h3, .h3': {
    fontSize: '1.25rem',
    lineHeight: '1.375',
    marginTop: '$6',
    marginBottom: '$4',
  },
  'pre, code, kbd, samp, tt': {
    fontSize: '0.7rem',
    lineHeight: '1.4',
  },
  'p, pre': {
    marginTop: '0',
    marginBottom: '$4',
  },
}

const colors = {
  body: {
    backgroundColor: '$background',
    color: '$text',
  },
  'h1, h2, h3': {
    color: '$heading',
  },
  a: {
    color: '$link',
    textDecoration: 'none',
  },
}

export const _globalStyles = [normalize, preflight, fonts, typography, colors]
