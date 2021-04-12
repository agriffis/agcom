import Image from 'next/image'
import Link from 'next/link'
import {IMAGES} from 'agcom/lib/site'

export function MyImage({href, name, post, title, wide, ...props}) {
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
