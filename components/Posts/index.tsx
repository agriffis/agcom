import {withProperties} from 'lib/utils'
import * as S from './styles'

export const Posts = withProperties(S.Posts, {
  Item: S.Item,
  Header: S.Header,
  Excerpt: S.Excerpt,
  Footer: S.Footer,
})
