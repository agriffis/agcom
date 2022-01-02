import {useEffect, useLayoutEffect, useState} from 'react'
import {_global} from './global'
import {_light, _dark} from './theme'
import {usePrefersColorScheme} from './usePrefersColorScheme'
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

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export const useDarkMode = () => {
  const scheme = usePrefersColorScheme()
  useIsomorphicLayoutEffect(() => {
    document.body.classList[scheme === 'dark' ? 'add' : 'remove'](
      `${darkTheme}`,
    )
  }, [scheme])
}
