import styled, {css, system} from '@agriffis/xstyled-styled-components'
import {ComponentProps, useRef} from 'react'
import {useButton} from '@react-aria/button'

// TODO focus ring
// https://medium.com/hackernoon/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
export const StyledButton = styled.button(
  () => css`
    background-color: accent;
    color: background;
    padding: 3 4;
    border-radius: 3;
    border: 2px solid;
    border-color: accent;
    &:hover,
    [data-variant='pressed'] {
      background-color: background;
      color: accent;
    }
    ${system}
  `,
)

export type ButtonProps = Parameters<typeof useButton>[0] &
  Omit<ComponentProps<typeof StyledButton>, 'onClick'>

export const Button = (props: ButtonProps) => {
  const ref = useRef()
  const {buttonProps, isPressed} = useButton(props, ref)
  return (
    <StyledButton
      {...props}
      {...buttonProps}
      data-variant={isPressed ? 'pressed' : null}
      ref={ref}
    />
  )
}
