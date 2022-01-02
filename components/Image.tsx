import {ComponentProps, forwardRef} from 'react'
import {styled} from 'stitches.config'
import NextImage from 'next/image'
import {IMAGES} from '../lib/site'

const StyledImage = styled(NextImage)

interface ImagePropsBase {}

interface ImagePropsWithName extends ImagePropsBase {
  name: string
  src?: never
}

interface ImagePropsWithSrc extends ImagePropsBase {
  name?: never
  src: any
}

type ImagePropsPoly = ImagePropsWithName | ImagePropsWithSrc

export type ImageProps = ImagePropsPoly &
  Omit<ComponentProps<typeof StyledImage>, keyof ImagePropsPoly>

export const Image = forwardRef<any, ImageProps>(
  ({post = false, wide = false, name, src, ...props}, ref) => (
    <StyledImage {...IMAGES[name]} {...props} ref={ref} />
  ),
)
