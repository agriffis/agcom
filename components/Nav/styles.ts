import {styled} from 'stitches.config'

export const Nav = styled('nav', {
  display: 'flex',
  fontFamily: '$meta',
  fontSize: '$metaLg',
  '& > *:not(:first-child)': {
    marginLeft: '$6',
  },

  '@desktop': {
    marginTop: '$4',
    marginLeft: '$1',
    flexDirection: 'column',
    '& > *:not(:first-child)': {
      marginLeft: '0',
      marginTop: '$2',
    },
  },
})
