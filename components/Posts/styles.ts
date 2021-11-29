import styled, {system} from '@agriffis/xstyled-styled-components'

export const Posts = styled.ul`
  ${system}
`

export const Item = styled.li`
  margin-bottom: 6;
`

export const Header = styled.header`
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`

export const Excerpt = styled.p`
  margin-bottom: 15;
`

export const Footer = styled.footer`
  font-family: meta;
  font-size: metaSm;
  margin-top: 1;
`
