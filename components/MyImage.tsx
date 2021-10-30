import Image from 'next/image'
import Link from 'next/link'
import {IMAGES} from 'lib/site'

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

type MyImageProps = MyImagePropsWithName | MyImagePropsWithSrc

export const MyImage = ({
  href,
  name,
  post,
  title,
  wide,
  ...props
}: MyImageProps) => {
  let r = <Image {...IMAGES[name]} {...props} />
  if (href) {
    r = (
      <Link href={href}>
        <a title={title}>{r}</a>
      </Link>
    )
  }
  if (post) {
    r = <div className={`post-image ${wide ? 'wide' : ''}`}>{r}</div>
  }
  return r
}
