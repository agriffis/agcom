import {styled} from 'theme'

export const Heading = styled('h1', {
  alignSelf: 'end',
  marginTop: '$6',
  marginBottom: '0',
})

export const PostMeta = styled('div', {
  marginTop: '$1',
  fontFamily: '$meta',
  fontSize: '$metaSm',
})

export const Main = styled('main', {
  marginTop: '$4',
})

export const Page = styled('div', {
  padding: '$pagePadding',
  display: 'grid',
  // minmax here allows pre to fit with max-width
  // https://css-tricks.com/preventing-a-grid-blowout/
  gridTemplateColumns: '$logo minmax(0, $container)',
  gridTemplateAreas: `
    'logo nav'
    'title title'
    'meta meta'
    'main main'
    'footer footer'
    `,
  columnGap: '$gutter',

  '@desktop': {
    // center on the content column, not the full grid including logo column
    marginLeft: `max(
      0px,
      calc(
        50vw - ($sizes$container / 2) -
        ($space$pagePadding + $sizes$logo + $space$gutter)
      )
    )`,
    gridTemplateAreas: `
      'logo title'
      '. meta'
      'nav main'
      '. footer'
      `,
  },

  [`& > nav`]: {
    gridArea: 'nav',
  },

  [`& > ${Heading}`]: {
    gridArea: 'title',
  },

  [`& > ${PostMeta}`]: {
    gridArea: 'meta',
  },

  [`& > main`]: {
    gridArea: 'main',
  },

  [`& > footer`]: {
    gridArea: 'footer',
  },
})
