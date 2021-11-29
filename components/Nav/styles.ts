import styled, {system} from '@agriffis/xstyled-styled-components'

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
