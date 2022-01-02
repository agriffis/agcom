import {styled} from 'stitches.config'

export const Media = styled('div', {
  marginTop: '$6',
  marginBottom: '$6',

  'img, video': {
    display: 'block',
    width: 'auto',
  },

  '@desktop': {
    marginLeft: '3em',
    marginRight: '2em',
    maxWidth: '28em',
  },

  variants: {
    wide: {
      true: {
        marginLeft: '0',
        marginRight: '0',
        maxWidth: 'none',
      },
    },
  },
})
