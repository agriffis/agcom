import styled, {system} from '@xstyled/styled-components'

export const Footer = styled.footer`
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
`

export const Site = styled.div`
  margin-bottom: 4;
  font-size: metaSm;
`

export const Social = styled.div`
  a {
    margin-left: 0.5em;
  }
  svg {
    width: 20px;
  }
`
