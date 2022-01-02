import {useDarkMode, useGlobalStyles} from 'theme'
import {AppProps} from 'next/app'

const App = ({Component, pageProps}: AppProps) => {
  useGlobalStyles()
  useDarkMode()
  return <Component {...pageProps} />
}

export default App
