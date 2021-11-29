import {ComponentProps} from 'react'
import {Link} from '../Link'
import * as I from '../icons'
import * as S from './styles'

type FooterProps = ComponentProps<typeof S.Footer> & {
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
      <S.Site>&copy; Aron Griffis {copyRange}</S.Site>
      <S.Social>
        <Link href="https://www.linkedin.com/in/agriffis">
          <I.LinkedIn />
        </Link>
        <Link href="https://twitter.com/arongriffis">
          <I.Twitter />
        </Link>
        <Link href="https://github.com/agriffis">
          <I.GitHub />
        </Link>
        <Link href="https://keybase.io/agriffis">
          <I.Keybase />
        </Link>
      </S.Social>
    </S.Footer>
  )
}
