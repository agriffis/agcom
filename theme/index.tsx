import * as NextThemes from 'next-themes'
import {useState} from 'react'
import {_global} from './global'
import {_light, _dark} from './themes'
import {createStitches} from '@stitches/react'

export const {
  createTheme,
  getCssText,
  globalCss,
  styled,
  theme: lightTheme,
} = createStitches(_light)

export const darkTheme = createTheme(_dark)

const globalStyles = globalCss(..._global)

export const useGlobalStyles = (styles = globalStyles) => {
  // stitches does its own detection but it's based on hashing JSON.stringify.
  // In production, just avoid ever calling the function twice.
  process.env.NODE_ENV === 'production' ? useState(styles) : styles()
}

export const ThemeProvider = props => (
  <NextThemes.ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    value={{light: lightTheme.className, dark: darkTheme.className}}
    {...props}
  />
)

export const useTheme = () =>
  NextThemes.useTheme().theme === 'dark' ? darkTheme : lightTheme
