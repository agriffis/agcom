import {ThemeProvider, useGlobalStyles} from 'theme'
import {AppProps} from 'next/app'

const App = ({Component, pageProps}: AppProps) => {
  useGlobalStyles()
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
