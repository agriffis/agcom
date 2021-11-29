import {Link} from 'components/Link'
import * as S from './styles'

export const Nav = props => (
  <S.Nav {...props}>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
  </S.Nav>
)
