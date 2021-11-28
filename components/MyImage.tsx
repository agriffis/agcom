import styled, {system, x} from '@xstyled/styled-components'
import Image from 'next/image'
import Link from 'next/link'
import {IMAGES} from 'lib/site'
import {ComponentPropsWithoutRef} from 'react'

interface MyImagePropsBase {
  href?: string
  post?: boolean
  title?: string
  wide?: boolean
}

interface MyImagePropsWithName extends MyImagePropsBase {
  name: string
  src?: never
}

interface MyImagePropsWithSrc extends MyImagePropsBase {
  name?: never
  src: any
}

type MyImagePropsPoly = MyImagePropsWithName | MyImagePropsWithSrc

type MyImageProps = MyImagePropsPoly &
  Omit<ComponentPropsWithoutRef<typeof Image>, keyof MyImagePropsPoly>

const StyledImage = styled(Image)`
  ${system}
`

export const MyImage = ({
  href,
  name,
  post,
  title,
  wide,
  ...props
}: MyImageProps) => {
  let r = <StyledImage {...IMAGES[name]} {...props} />
  if (href) {
    r = (
      <Link href={href}>
        <a title={title}>{r}</a>
      </Link>
    )
  }
  if (post) {
    r = <x.div className="post-image">{r}</x.div>
  }
  return r
}
