import styled, {system, th} from '@xstyled/styled-components'

export const Heading = styled.h1`
  align-self: end;
  margin-top: 6;
  margin-bottom: 0;
  ${system}
`

export const PostMeta = styled.div`
  margin-top: 1;
  font-family: meta;
  font-size: metaSm;
`

export const Main = styled.main`
  margin-top: 4;
`

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

  > nav {
    grid-area: nav;
  }

  > ${Heading} {
    grid-area: title;
  }

  > ${PostMeta} {
    grid-area: meta;
  }

  > main {
    grid-area: main;
  }

  > footer {
    grid-area: footer;
  }

  ${system}
`

export const Nav = styled.nav`
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
