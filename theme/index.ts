import {useState} from 'react'
import {_global} from './global'
import {_theme} from './theme'
import {createStitches} from '@stitches/react'

export const {getCssText, globalCss, styled, theme} = createStitches(_theme)

const globalStyles = globalCss(..._global)

export const useGlobalStyles = (styles = globalStyles) => {
  // stitches does its own detection but it's based on hashing JSON.stringify.
  // In production, just avoid ever calling the function twice.
  process.env.NODE_ENV === 'production' ? useState(styles) : styles()
}
