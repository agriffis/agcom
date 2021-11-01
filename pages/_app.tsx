import 'normalize.css'
import 'styles/screen.scss'
import 'styles/papercolor.css'

interface AppProps {
  Component: any
  pageProps: object
}

const App = ({Component, pageProps}: AppProps) => <Component {...pageProps} />

export default App
