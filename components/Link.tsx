import {ComponentProps} from 'react'
import NextLink, {LinkProps as NextLinkPropsBase} from 'next/link'
import {partitionProps} from '../lib/utils'

interface AProps extends Omit<ComponentProps<'a'>, 'href'> {}

interface NextLinkProps
  extends Partial<Pick<NextLinkPropsBase, 'href'>>,
    Omit<NextLinkPropsBase, 'href'> {}

interface LinkProps extends NextLinkProps, AProps {}

export const Link = (props: LinkProps) => {
  const [{href, ...nextLinkProps}, rest] = partitionProps<
    NextLinkProps,
    AProps
  >(props, [
    'href',
    'as',
    'replace',
    'scroll',
    'shallow',
    'passHref',
    'prefetch',
    'locale',
  ])
  let result = <a {...rest} />
  if (href) {
    result = (
      <NextLink href={href} {...nextLinkProps}>
        {result}
      </NextLink>
    )
  }
  return result
}
