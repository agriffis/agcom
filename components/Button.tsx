import {styled} from 'theme'
import {ComponentProps, useRef} from 'react'
import {useButton} from '@react-aria/button'

const pressedStyle = {
  backgroundColor: '$background',
  color: '$accent',
}

// TODO focus ring
// https://medium.com/hackernoon/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
export const StyledButton = styled('button', {
  backgroundColor: '$accent',
  color: '$background',
  padding: '$3 $4',
  borderRadius: '3px',
  border: '2px solid',
  borderColor: '$accent',
  '&:hover': pressedStyle,
  variants: {
    pressed: {
      true: pressedStyle,
    },
  },
})

export type ButtonProps = Parameters<typeof useButton>[0] &
  Omit<ComponentProps<typeof StyledButton>, 'onClick'>

export const Button = (props: ButtonProps) => {
  const ref = useRef()
  const {buttonProps, isPressed} = useButton(props, ref)
  return (
    <StyledButton {...props} {...buttonProps} pressed={isPressed} ref={ref} />
  )
}
