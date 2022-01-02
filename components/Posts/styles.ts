import {styled} from 'stitches.config'

export const Posts = styled('ul')

export const Item = styled('li', {
  marginBottom: '$6',
})

export const Header = styled('header', {
  '& > *:first-child': {
    marginTop: '0',
  },
  '& > *:last-child': {
    marginBottom: '0',
  },
})

export const Excerpt = styled('p', {
  marginBottom: '$15',
})

export const Footer = styled('footer', {
  fontFamily: '$meta',
  fontSize: '$metaSm',
  marginTop: '$1',
})
