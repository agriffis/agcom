import {styled} from 'theme'

export const Footer = styled('footer', {
  marginTop: '$6',
  paddingTop: '$4',
  paddingBottom: '$8',
  borderTop: '3px solid',
  borderTopColor: '$accent',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  fontFamily: '$meta',
})

export const Site = styled('div', {
  marginBottom: '$4',
  fontSize: '$metaSm',
})

export const Social = styled('div', {
  a: {
    marginLeft: '0.5em',
  },
  svg: {
    width: '20px',
  },
})
