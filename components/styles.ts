import styled, {system, th} from '@xstyled/styled-components'
import {withProperties} from 'lib/utils'

export const Page = styled.div`
  padding: pagePadding;
  display: grid;
  // minmax here allows pre to fit with max-width
  // https://css-tricks.com/preventing-a-grid-blowout/
  grid-template-columns: ${th('sizes.logo')} minmax(0, ${th('sizes.container')});
  grid-template-areas:
    'logo nav'
    'title title'
    'meta meta'
    'main main'
    'footer footer';
  column-gap: gutter;

  @media (min-width: desktop) {
    // center on the content column, not the full grid including logo column
    margin-left: max(
      0px,
      calc(
        50vw - (${th('sizes.container')} / 2) -
          (
            ${th('space.pagePadding')} + ${th('sizes.logo')} +
              ${th('space.gutter')}
          )
      )
    );
    grid-template-areas:
      'logo title'
      '. meta'
      'nav main'
      '. footer';
  }

  ${system}
`

export const Nav = styled.nav`
  grid-area: nav;
  display: flex;
  font-family: meta;
  font-size: metaLg;

  > *:not(:first-child) {
    margin-left: 6;
  }

  @media (min-width: desktop) {
    margin-top: 4;
    margin-left: 1;
    flex-direction: column;

    > *:not(:first-child) {
      margin-left: 0;
      margin-top: 2;
    }
  }

  ${system}
`

export const Heading = styled.h1`
  grid-area: title;
  align-self: end;
  margin-top: 6;
  margin-bottom: 0;
  ${system}
`

export const PostMeta = styled.div`
  grid-area: meta;
  margin-top: 1;
  font-family: meta;
  font-size: metaSm;
`

export const Main = styled.main`
  grid-area: main;
  margin-top: 4;
`

export const Footer = withProperties(
  styled.footer`
    grid-area: footer;
    margin-top: 6;
    padding-top: 4;
    padding-bottom: 8;
    border-top: 3px solid;
    border-top-color: accent;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: meta;
    ${system}
  `,
  {
    Site: styled.div`
      margin-bottom: 4;
      font-size: metaSm;
      ${system}
    `,
    Social: styled.div`
      a {
        margin-left: 0.5em;
      }
      svg {
        width: 20px;
      }
      ${system}
    `,
  },
)

export const Posts = withProperties(
  styled.ul`
    ${system}
  `,
  {
    Item: styled.li`
      margin-bottom: 6;
    `,
    Header: styled.header`
      > *:first-child {
        margin-top: 0;
      }
      > *:last-child {
        margin-bottom: 0;
      }
    `,
    Excerpt: styled.p`
      margin-bottom: 15;
    `,
    Footer: styled.footer`
      font-family: meta;
      font-size: metaSm;
      margin-top: 1;
    `,
  },
)
