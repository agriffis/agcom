import {useEffect, useState} from 'react'

const darkQuery =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)')

const lightQuery =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: light)')

const getPreferred = () =>
  darkQuery?.matches ? 'dark' : lightQuery?.matches ? 'light' : 'no-preference'

export const usePrefersColorScheme = () => {
  const [preferred, setPreferred] = useState(getPreferred)

  useEffect(() => {
    const listener = () => setPreferred(getPreferred())
    darkQuery!.addEventListener('change', listener)
    lightQuery!.addEventListener('change', listener)
    return () => {
      darkQuery!.removeEventListener('change', listener)
      lightQuery!.removeEventListener('change', listener)
    }
  }, [])

  return preferred
}
