import {useGlobalStyles} from 'theme'
import {AppProps} from 'next/app'

const App = ({Component, pageProps}: AppProps) => {
  useGlobalStyles()
  return <Component {...pageProps} />
}

export default App
