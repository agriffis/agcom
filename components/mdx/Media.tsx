import styled, {SystemProps, css, system} from '@xstyled/styled-components'

interface MediaProps {
  variant?: 'normal' | 'wide'
}

export const Media = styled.div<MediaProps & SystemProps>(
  ({variant = 'normal'}) => css`
    margin-top: 6;
    margin-bottom: 6;

    img,
    video {
      display: block;
      width: auto;
    }

    @media (min-width: desktop) {
      margin-left: 3em;
      margin-right: 2em;
      max-width: 28em;

      ${variant === 'wide' &&
      css`
        margin-left: 0;
        margin-right: 0;
        max-width: none;
      `}
    }

    ${system}
  `,
)
