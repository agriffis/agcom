import * as I from './icons'
import * as S from './styles'

interface FooterProps {
  copyStart?: number
  copyEnd?: number
}

export const Footer = ({
  copyStart = 2011,
  copyEnd = new Date().getUTCFullYear(),
  ...props
}: FooterProps) => {
  const copyRange = `${copyStart}${copyStart === copyEnd ? '' : `–${copyEnd}`}`
  return (
    <S.Footer {...props}>
      <S.Footer.Site>&copy; Aron Griffis {copyRange}</S.Footer.Site>
      <S.Footer.Social>
        {/* svg icons from https://simpleicons.org */}
        <a href="https://www.linkedin.com/in/agriffis">
          <I.LinkedIn />
        </a>
        <a href="https://twitter.com/arongriffis">
          <I.Twitter />
        </a>
        <a href="https://github.com/agriffis">
          <I.GitHub />
        </a>
        <a href="https://keybase.io/agriffis">
          <I.Keybase />
        </a>
      </S.Footer.Social>
    </S.Footer>
  )
}
